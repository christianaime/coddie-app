#!/usr/bin/env node
import * as p from "@clack/prompts";
import { setTimeout } from "node:timers/promises";
import picocolors from "picocolors";
import path from "node:path";
import fs from "fs-extra";
import { execa } from "execa";

// ES modules equivalent of __dirname
const __dirname = import.meta.dirname;

// Merge .env.example files from selected features
async function mergeEnvFiles(projectDir: string, project: any) {
  const envExamplePath = path.join(projectDir, ".env.example");
  let envContent = "";

  // Start with base Next.js .env content if it exists
  try {
    const existingEnv = await fs.readFile(envExamplePath, "utf-8");
    envContent = existingEnv + "\n\n";
  } catch {
    // No existing .env.example file
  }

  // Add auth provider env vars
  if (project.auth === "supabase") {
    try {
      const supabaseEnv = await fs.readFile(
        path.join(projectDir, "env.supabase.example"),
        "utf-8"
      );
      envContent += supabaseEnv + "\n\n";
      // Remove the individual template file
      await fs.remove(path.join(projectDir, "env.supabase.example"));
    } catch (err) {
      if (err instanceof Error) {
        p.log.warning(`Failed to process supabase env: ${err.message}`);
      }
    }
  } else if (project.auth === "clerk") {
    try {
      const clerkEnv = await fs.readFile(
        path.join(projectDir, "env.clerk.example"),
        "utf-8"
      );
      envContent += clerkEnv + "\n\n";
      // Remove the individual template file
      await fs.remove(path.join(projectDir, "env.clerk.example"));
    } catch (err) {
      if (err instanceof Error) {
        p.log.warning(`Failed to process clerk env: ${err.message}`);
      }
    }
  }

  // Add Stripe env vars
  if (project.stripe) {
    try {
      const stripeEnv = await fs.readFile(
        path.join(projectDir, "env.stripe.example"),
        "utf-8"
      );
      envContent += stripeEnv + "\n\n";
      await fs.remove(path.join(projectDir, "env.stripe.example"));
    } catch (err) {
      if (err instanceof Error) {
        p.log.warning(`Failed to process stripe env: ${err.message}`);
      }
    }
  }

  // Write the merged .env.example file
  if (envContent.trim()) {
    await fs.writeFile(envExamplePath, envContent.trim());
  }
}

async function main() {
  console.clear();

  await setTimeout(1000);

  p.intro(`${picocolors.bgCyan(picocolors.black(" Coddie App "))}`);

  // Parse CLI arguments
  const args = process.argv.slice(2);
  const projectName = args[0];
  const hasNextFlag = args.includes("--next");

  p.log.step("Create a new project");

  // Build questions conditionally
  const questions: any = {};

  // Always ask for project path (with default from CLI arg)
  questions.path = () =>
    p.text({
      message: "Where should we create your project?",
      placeholder: projectName || "./coddie-app",
      defaultValue: projectName || "./coddie-app",
      validate(value) {
        if (value.length === 0) {
          return "Project path is required.";
        }
        const resolvedPath = path.resolve(value);
        if (
          fs.existsSync(resolvedPath) &&
          fs.readdirSync(resolvedPath).length > 0
        ) {
          return `Directory at ${resolvedPath} is not empty.`;
        }
      },
    });

  // Only ask framework question if no --next flag
  if (!hasNextFlag) {
    questions.framework = () =>
      p.confirm({
        message: "Use the default installation for Next.js?",
        initialValue: true,
      });
  }

  // Always ask feature questions
  questions.auth = () =>
    p.select({
      message: "Select an Authentication provider",
      options: [
        { value: "none", label: "None" },
        { value: "supabase", label: "Supabase Auth" },
        { value: "clerk", label: "Clerk" },
      ],
    });

  questions.ui = () =>
    p.confirm({
      message: "Install ShadCN UI?",
    });

  questions.sentry = () =>
    p.confirm({
      message: "Install Sentry for error logging?",
    });

  questions.stripe = () =>
    p.confirm({
      message: "Install Stripe for payments?",
    });

  questions.editor = () =>
    p.select({
      message: "What is your current editor (For Project Rules)",
      options: [
        { value: "vscode", label: "VS Code" },
        { value: "cursor", label: "Cursor" },
        { value: "windsurf", label: "Windsurf" },
      ],
    });

  const project = (await p.group(questions, {
    onCancel: () => {
      p.cancel("Operation cancelled.");
      process.exit(0);
    },
  })) as {
    path: string;
    framework?: boolean;
    auth: "none" | "supabase" | "clerk";
    ui: boolean;
    sentry: boolean;
    stripe: boolean;
    editor: "vscode" | "cursor" | "windsurf";
  };

  // Determine if we should use Next.js
  const useNextJs = hasNextFlag || project.framework;

  if (!useNextJs) {
    p.cancel("Other frameworks coming soon! Use --next flag for now.");
    process.exit(0);
  }

  // Show summary of what will be created
  p.log.info(`Creating ${project.path} with:`);
  p.log.info("• Next.js with TypeScript & Tailwind CSS");
  if (project.auth !== "none") p.log.info(`• Auth: ${project.auth}`);
  if (project.ui) p.log.info("• ShadCN UI");
  if (project.sentry) p.log.info("• Sentry monitoring");
  if (project.stripe) p.log.info("• Stripe payments");
  p.log.info(`• Editor: ${project.editor}`);

  // Important note for Sentry users
  if (project.sentry) {
    p.log.warning(
      "⚠️  Sentry setup requires a Sentry account. Make sure you have one at https://sentry.io before proceeding."
    );
    const shouldContinue = await p.confirm({
      message: "Do you have a Sentry account and want to continue?",
    });

    if (!shouldContinue) {
      p.cancel(
        "Setup cancelled. Create a Sentry account and run the command again."
      );
      process.exit(0);
    }
  }

  const s = p.spinner();
  s.start("Creating Next.js project...");

  try {
    // Create Next.js app with opinionated defaults
    await execa(
      "npx",
      [
        "create-next-app@latest",
        project.path,
        "--typescript",
        "--tailwind",
        "--eslint",
        "--app",
        "--yes",
      ],
      { cwd: process.cwd() }
    );
    s.stop("Next.js project created.");
  } catch (error) {
    s.stop("Failed to create Next.js project.");
    if (error instanceof Error) {
      p.log.error((error as { stderr?: string }).stderr || error.message);
    }
    process.exit(1);
  }

  // Get project directory for subsequent operations
  const projectDir = path.resolve(process.cwd(), project.path);

  // Copy feature templates on top of Next.js base
  const s_templates = p.spinner();
  s_templates.start("Setting up selected features...");

  try {
    // Copy auth templates based on selection
    if (project.auth === "supabase") {
      const supabaseTemplateDir = path.resolve(
        __dirname,
        "../templates/auth/supabase"
      );
      await fs.copy(supabaseTemplateDir, projectDir, { overwrite: true });
    } else if (project.auth === "clerk") {
      const clerkTemplateDir = path.resolve(
        __dirname,
        "../templates/auth/clerk"
      );
      await fs.copy(clerkTemplateDir, projectDir, { overwrite: true });
    }

    // Copy payment templates
    if (project.stripe) {
      const stripeTemplateDir = path.resolve(
        __dirname,
        "../templates/payments/stripe"
      );
      await fs.copy(stripeTemplateDir, projectDir, { overwrite: true });
    }

    // Merge .env.example files from all selected features
    await mergeEnvFiles(projectDir, project);

    s_templates.stop("Features configured.");
  } catch (error: unknown) {
    s_templates.stop("Failed to configure features.");
    if (error instanceof Error) {
      p.log.error(error.message);
    }
    process.exit(1);
  }

  const s2 = p.spinner();
  s2.start("Installing dependencies...");

  try {
    // Install base dependencies
    await execa("npm", ["install"], { cwd: projectDir });

    // TEMPORARY: Individual installs
    // Install auth provider
    if (project.auth === "supabase") {
      await execa(
        "npm",
        ["install", "@supabase/supabase-js", "@supabase/ssr"],
        {
          cwd: projectDir,
        }
      );
    } else if (project.auth === "clerk") {
      await execa("npm", ["install", "@clerk/nextjs"], { cwd: projectDir });
    }

    // Install Stripe
    if (project.stripe) {
      await execa("npm", ["install", "stripe"], { cwd: projectDir });
    }
    s2.stop("Dependencies installed.");
  } catch (error) {
    s2.stop("Failed to install dependencies.");
    if (error instanceof Error) {
      p.log.error((error as { stderr?: string }).stderr || error.message);
    }
    process.exit(1);
  }

  // Setup ShadCN UI automatically
  if (project.ui) {
    const s_shadcn = p.spinner();
    s_shadcn.start("Setting up ShadCN UI...");

    try {
      // Run shadcn init with user interaction enabled
      s_shadcn.stop("ShadCN UI setup requires user input...");
      p.log.info("🎨 Please select your preferred base color for ShadCN UI:");

      await execa("npx", ["shadcn@latest", "init"], {
        cwd: projectDir,
        stdio: "inherit", // Allow interactive prompts
      });

      s_shadcn.start("Installing basic ShadCN components...");

      // Install commonly used components
      await execa(
        "npx",
        ["shadcn@latest", "add", "button", "card", "input", "label"],
        { cwd: projectDir }
      );

      s_shadcn.stop("ShadCN UI configured with basic components.");
    } catch (error) {
      s_shadcn.stop("ShadCN UI setup failed.");
      p.log.error(
        "Failed to setup ShadCN UI. You can run `npx shadcn@latest init` manually later."
      );
    }
  }

  // Setup Sentry automatically
  if (project.sentry) {
    const s_sentry = p.spinner();
    s_sentry.start("Setting up Sentry...");

    try {
      // Run Sentry wizard - will prompt user for authentication
      await execa("npx", ["@sentry/wizard@latest", "-i", "nextjs"], {
        cwd: projectDir,
        stdio: "inherit", // Allow interactive prompts for login
      });

      s_sentry.stop("Sentry configured.");
    } catch (error) {
      s_sentry.stop("Failed to configure Sentry.");
      if (error instanceof Error) {
        p.log.error((error as { stderr?: string }).stderr || error.message);
      }
      process.exit(1);
    }
  }

  // Install editor rules
  const s3 = p.spinner();
  s3.start(`Configuring ${project.editor}...`);
  try {
    const editorConfigDir = path.resolve(
      __dirname,
      `../templates/editor-configs/${project.editor}`
    );
    await fs.copy(editorConfigDir, projectDir);
    s3.stop(`${project.editor} configured.`);
  } catch (error) {
    s3.stop(`Failed to configure ${project.editor}.`);
    if (error instanceof Error) {
      p.log.error(error.message);
    }
    process.exit(1);
  }

  // Git initialization
  const s_git = p.spinner();
  s_git.start("Initializing Git repository...");

  try {
    await execa("git", ["init"], { cwd: projectDir });
    await execa("git", ["add", "."], { cwd: projectDir });
    await execa("git", ["commit", "-m", "Initial commit from Coddie CLI"], {
      cwd: projectDir,
    });
    s_git.stop("Git repository initialized.");
  } catch (error) {
    s_git.stop("Failed to initialize Git repository.");
    if (error instanceof Error) {
      p.log.error((error as { stderr?: string }).stderr || error.message);
    }
    process.exit(1);
  }

  // Build next steps instructions
  let nextSteps = `cd ${project.path}`;

  // Add auth setup instructions
  if (project.auth === "supabase") {
    nextSteps += `\n\n📋 Setup Supabase Authentication:`;
    nextSteps += `\n1. Create account at https://supabase.com`;
    nextSteps += `\n2. Create a new project`;
    nextSteps += `\n3. Copy API keys to .env.local (see .env.example)`;
    nextSteps += `\n4. Enable authentication providers in Supabase dashboard`;
    nextSteps += `\n5. See README.supabase.md for detailed setup`;
  } else if (project.auth === "clerk") {
    nextSteps += `\n\n📋 Setup Clerk Authentication:`;
    nextSteps += `\n1. Create account at https://clerk.com`;
    nextSteps += `\n2. Create a new application`;
    nextSteps += `\n3. Copy API keys to .env.local (see .env.example)`;
    nextSteps += `\n4. Configure OAuth providers if needed`;
    nextSteps += `\n5. See README.clerk.md for detailed setup`;
  }

  if (project.sentry) {
    nextSteps += `\n\n📋 Sentry Setup Complete:`;
    nextSteps += `\n• Error monitoring, tracing, and session replay configured`;
    nextSteps += `\n• Visit your Sentry dashboard to view captured data`;
    nextSteps += `\n• Test by visiting /sentry-example-page in your app`;
  }

  if (project.stripe) {
    nextSteps += `\n\n📋 Setup Stripe Payments:`;
    nextSteps += `\n1. Create account at https://stripe.com`;
    nextSteps += `\n2. Get API keys from Stripe Dashboard`;
    nextSteps += `\n3. Copy keys to .env.local (see .env.example)`;
    nextSteps += `\n4. Create products and prices in Stripe Dashboard`;
    nextSteps += `\n5. Set up webhook endpoint for your domain`;
    nextSteps += `\n6. See README.stripe.md for detailed setup`;
  }

  nextSteps += `\n\n📚 Git Best Practices:`;
  nextSteps += `\n• Consider creating a 'develop' branch for feature development`;
  nextSteps += `\n• Keep 'main' branch stable for production releases`;
  nextSteps += `\n• Use feature branches for new development`;
  nextSteps += `\n• Commands: git checkout -b develop && git checkout -b feature/your-feature`;

  nextSteps += `\n\n🔗 GitHub Setup (Optional):`;
  nextSteps += `\n1. Create a new repository at https://github.com/new`;
  nextSteps += `\n2. git remote add origin <your-repo-url>`;
  nextSteps += `\n3. git push -u origin main`;

  nextSteps += `\n\n🚀 Start development:\nnpm run dev`;

  p.outro(`Project created successfully! 🎉\n${nextSteps}`);
}

main().catch(console.error);
