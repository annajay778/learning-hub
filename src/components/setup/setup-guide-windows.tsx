"use client";

import { useState, useEffect } from "react";
import { SetupNav } from "./setup-nav";
import { SetupHero } from "./setup-hero";
import { StepCard } from "./step-card";
import { CodeBlock } from "./code-block";
import { Callout } from "./callout";
import { HotTips } from "./hot-tips";
import {
  RefreshCw,
  Mic,
  Rocket,
  FileCode,
  Search,
  Zap,
  TrendingUp,
  Megaphone,
  Wrench,
  MessageSquare,
  Mail,
  Calendar,
  MonitorSmartphone,
  BookOpen,
  Palette,
  PartyPopper,
  Flame,
} from "lucide-react";

const TOTAL_STEPS = 13;

interface Tip {
  id: string;
  body: string;
  author: string;
  createdAt: Date;
}

export function SetupGuideWindows({ tips }: { tips: Tip[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stepEls = document.querySelectorAll<HTMLElement>("[data-step]");
    if (stepEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const step = Number(entry.target.getAttribute("data-step"));
            if (step) setCurrentStep(step);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );

    stepEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-svh bg-[var(--s-bg)] ${theme === "dark" ? "setup-dark" : "setup-light"}`}>
      <SetupNav currentStep={currentStep} totalSteps={TOTAL_STEPS} theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />
      <SetupHero theme={theme} />

      {/* Prerequisites */}
      <div id="step-1-prereq" className="scroll-mt-20 mx-auto max-w-3xl px-4 pb-6 pt-12 sm:px-6">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 sm:p-8">
          <h2 className="mb-3 text-base font-semibold text-[var(--s-text)]">You&apos;re all set</h2>
          <p className="text-sm text-[var(--s-text-muted)]">
            Your GitHub, Vercel, and Anthropic accounts have already been
            created by the platform team. You just need a Windows PC and an
            internet connection.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-24 sm:px-6">
        {/* ═══ STEP 1: Windows Terminal ═══ */}
        <StepCard stepNumber={1} title="Windows Terminal" id="step-1" time="2 min">
          <p>
            Your PC may have the classic Command Prompt, but it wasn&apos;t
            designed for working alongside AI. Windows Terminal is — it supports
            tabs, split panes, and modern features that make AI-assisted
            development smooth.
          </p>
          <p className="font-medium text-[var(--s-text-strong)]">Check if you already have it:</p>
          <p className="text-[var(--s-text-muted)] text-xs">
            Windows 11 comes with Windows Terminal pre-installed. Just search
            for &ldquo;Terminal&rdquo; in the Start menu. If you&apos;re on
            Windows 10 or don&apos;t see it, install it:
          </p>
          <CodeBlock code="winget install Microsoft.WindowsTerminal" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Or download it from the{" "}
            <a
              href="https://aka.ms/terminal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--s-accent)] underline decoration-[var(--s-accent)]/30 underline-offset-2 hover:decoration-[var(--s-accent)]"
            >
              Microsoft Store &rarr;
            </a>
          </p>
          <Callout type="success" title="You'll know it worked when">
            Open Windows Terminal from the Start menu. You should see a
            PowerShell prompt ready for input.
          </Callout>
        </StepCard>

        {/* ═══ STEP 2: Node.js ═══ */}
        <StepCard stepNumber={2} title="Node.js" id="step-2" time="1 min">
          <p>
            Node.js is the engine that makes Claude Code and all our web
            projects run. You won&apos;t interact with it directly — it just
            needs to be installed on your PC.
          </p>
          <p className="font-medium text-[var(--s-text-strong)]">Check if you already have it:</p>
          <CodeBlock code="node -v" />
          <p>
            If you see{" "}
            <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-[var(--s-accent-green)]">v20</code>{" "}
            or higher (e.g., v22.14.0 or v24.13.0), skip to Step 4. Otherwise:
          </p>
          <p>
            Install with winget:
          </p>
          <CodeBlock code="winget install OpenJS.NodeJS.LTS" />
          <p>
            Or{" "}
            <a
              href="https://nodejs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--s-accent)] underline decoration-[var(--s-accent)]/30 underline-offset-2 hover:decoration-[var(--s-accent)]"
            >
              download the installer from nodejs.org &rarr;
            </a>
          </p>
          <Callout type="warning" title="Restart your terminal after installing">
            After installing Node.js, close and reopen Windows Terminal so
            the <code className="text-[var(--s-accent)]">node</code> command is
            available on your PATH.
          </Callout>
          <Callout type="success" title="You'll know it worked when">
            <code className="text-[var(--s-accent-green)]">node -v</code> prints a version
            number like <code className="text-[var(--s-accent-green)]">v22.14.0</code>, and{" "}
            <code className="text-[var(--s-accent-green)]">npm -v</code> also prints a
            number (npm is a tool that comes bundled with Node automatically).
          </Callout>
        </StepCard>

        {/* ═══ STEP 3: Your Workspace ═══ */}
        <StepCard stepNumber={3} title="Your Workspace" id="step-3" time="1 min">
          <p>
            Before we install Claude, we need a folder for it to work in.
            Claude reads every file in the folder where you launch it, so
            having a dedicated workspace keeps things organized.
          </p>
          <CodeBlock code={`mkdir ~\\Desktop\\AI-Builds\ncd ~\\Desktop\\AI-Builds`} />
          <p className="text-[var(--s-text-muted)] text-xs">
            This creates a folder called &ldquo;AI-Builds&rdquo; on your
            Desktop where you can see it. All your projects will live here.
          </p>
          <Callout type="info">
            In PowerShell, <code className="text-[var(--s-accent)]">~</code>{" "}
            is a shortcut for your user folder (e.g.,{" "}
            <code className="text-[var(--s-accent)]">C:\Users\YourName</code>).
            Both <code className="text-[var(--s-accent)]">mkdir</code> and{" "}
            <code className="text-[var(--s-accent)]">cd</code> work the same
            way they do on Mac.
          </Callout>
          <Callout type="success" title="You'll know it worked when">
            You see an <strong className="text-[var(--s-text-strong)]">AI-Builds</strong>{" "}
            folder on your Desktop, and your terminal prompt shows you&apos;re
            inside it.
          </Callout>
        </StepCard>

        {/* ═══ STEP 4: Install Claude Code ═══ */}
        <StepCard stepNumber={4} title="Install Claude Code" id="step-4" time="2 min">
          <p>
            This is the AI that writes code, runs commands, and builds features
            with you. You talk to it in plain English inside your terminal, and
            it does the work.
          </p>
          <CodeBlock code="npm install -g @anthropic-ai/claude-code" />
          <p className="text-[var(--s-text-muted)] text-xs">
            The <code className="text-[var(--s-accent)]">-g</code> flag installs it
            globally, meaning you can run{" "}
            <code className="text-[var(--s-accent)]">claude</code> from any folder on
            your PC.
          </p>
          <p>
            If you get a permission error (you&apos;ll see{" "}
            <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-red-400">Access is denied</code>{" "}
            or similar), try running Windows Terminal as Administrator
            (right-click &rarr; Run as administrator), or use this alternative
            instead:
          </p>
          <CodeBlock code="npx @anthropic-ai/claude-code" />
          <Callout type="warning" title="Don't launch it yet">
            We just installed Claude — but don&apos;t run it yet. In the next
            step, we&apos;ll make sure it opens in the right folder and set up
            a shortcut.
          </Callout>
        </StepCard>

        {/* ═══ STEP 5: Launch Claude & CAM ═══ */}
        <StepCard stepNumber={5} title="Launch Claude & CAM" id="step-5" time="2 min">
          <p>
            Now let&apos;s launch Claude for the first time — from inside your
            workspace folder. Then we&apos;ll create a shortcut so you never
            have to type the full command again.
          </p>
          <p className="font-medium text-[var(--s-text-strong)]">1. Make sure you&apos;re in your workspace:</p>
          <p className="text-[var(--s-text-muted)] text-xs">
            If you already have a workspace folder, just cd into it:
          </p>
          <CodeBlock code="cd ~\Desktop\AI-Builds" />
          <p className="text-[var(--s-text-muted)] text-xs">
            If you&apos;re skipping ahead and don&apos;t have one yet, create
            it now:
          </p>
          <CodeBlock code={`mkdir ~\\Desktop\\AI-Builds\ncd ~\\Desktop\\AI-Builds`} />
          <p className="font-medium text-[var(--s-text-strong)]">2. Launch Claude:</p>
          <CodeBlock code="claude" />
          <p className="text-[var(--s-text-muted)] text-xs">
            The first time, it will open a browser window where you sign in
            with your Anthropic account. After you sign in, go back to your
            terminal.
          </p>
          <Callout type="success" title="You'll know it worked when">
            Your terminal shows an interactive session with a{" "}
            <code className="text-[var(--s-accent-green)]">&gt;</code> prompt waiting for
            your input. Type &ldquo;hello&rdquo; — Claude should respond.
          </Callout>

          <p className="font-medium text-[var(--s-text-strong)]">3. Create the <code className="text-[var(--s-accent)]">cam</code> shortcut:</p>
          <p className="text-[var(--s-text-muted)] text-xs">
            Right now, launching Claude requires typing a long command with
            flags. We&apos;re going to create a shortcut so you just type
            three letters: <code className="text-[var(--s-accent)]">cam</code>.
            Tell Claude:
          </p>
          <CodeBlock code={`Add a function called cam to my PowerShell profile that runs "claude --permission-mode auto". Then reload my profile. Explain what you did.`} />

          <Callout type="info">
            <strong className="text-[var(--s-text-strong)]">cam</strong> = Claude Auto Mode.
            On Windows, this creates a function in your PowerShell profile (usually{" "}
            <code className="text-[var(--s-accent)]">$PROFILE</code> at{" "}
            <code className="text-[var(--s-accent)]">~\Documents\PowerShell\Microsoft.PowerShell_profile.ps1</code>).
            When you type <code className="text-[var(--s-accent)]">cam</code>, Claude
            launches and handles file edits, commands, and tool calls without
            stopping to ask. Always navigate to your project folder first,
            then type <code className="text-[var(--s-accent)]">cam</code>.
          </Callout>
          <Callout type="success" title="You'll know it worked when">
            Type <code className="text-[var(--s-accent-green)]">/exit</code>,
            then <code className="text-[var(--s-accent-green)]">cam</code> —
            Claude launches in auto mode without permission prompts.
          </Callout>
        </StepCard>

        {/* ═══ STEP 6: GitHub ═══ */}
        <StepCard stepNumber={6} title="GitHub" id="step-6" time="3 min">
          <p>
            GitHub is where your code lives online. Think of it as Google Docs
            for code — it tracks every change, lets you undo mistakes, and
            makes collaboration possible.
          </p>
          <Callout type="warning">
            If you&apos;re inside a Claude session, type{" "}
            <code className="text-[var(--s-accent)]">/exit</code> first. Run these
            commands in a regular terminal tab — the login flow works better
            outside of Claude.
          </Callout>
          <p className="font-medium text-[var(--s-text-strong)]">Check if you already have them:</p>
          <CodeBlock code={`git --version\ngh --version`} />
          <p>
            If either says{" "}
            <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-red-400">command not found</code>,
            install both:
          </p>
          <CodeBlock code={`winget install Git.Git\nwinget install GitHub.cli`} />
          <p className="text-[var(--s-text-muted)] text-xs">
            Or download from{" "}
            <a
              href="https://git-scm.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--s-accent)] underline decoration-[var(--s-accent)]/30 underline-offset-2 hover:decoration-[var(--s-accent)]"
            >
              git-scm.com
            </a>{" "}
            and{" "}
            <a
              href="https://cli.github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--s-accent)] underline decoration-[var(--s-accent)]/30 underline-offset-2 hover:decoration-[var(--s-accent)]"
            >
              cli.github.com
            </a>.
          </p>
          <p className="text-[var(--s-text-muted)] text-xs">
            <code className="text-[var(--s-accent)]">git</code> is the version control
            tool that tracks changes.{" "}
            <code className="text-[var(--s-accent)]">gh</code> is GitHub&apos;s helper
            that makes it easier to create pull requests and manage your code
            from the terminal.
          </p>
          <Callout type="warning" title="Restart your terminal after installing">
            After installing Git and GitHub CLI, close and reopen Windows
            Terminal so the new commands are available on your PATH.
          </Callout>
          <p className="font-medium text-[var(--s-text-strong)]">Tell Git who you are:</p>
          <CodeBlock
            code={`git config --global user.name "Your Name"\ngit config --global user.email "you@campminder.com"\ngit config --global init.defaultBranch main`}
          />
          <p className="text-[var(--s-text-muted)] text-xs">
            This labels your changes with your name and email so your team knows
            who made what. The last line sets &ldquo;main&rdquo; as the default
            branch name (an industry standard).
          </p>
          <p className="font-medium text-[var(--s-text-strong)]">Connect your GitHub account:</p>
          <CodeBlock code="gh auth login" />
          <Callout type="warning" title="Password field looks blank — that's normal">
            When the terminal asks for your password, it won&apos;t show any
            characters as you type — no dots, no cursor movement, nothing. This
            is a security feature. Just type your GitHub password and press
            Enter. It&apos;s working even though it looks like nothing is
            happening.
          </Callout>
          <p className="text-[var(--s-text-muted)] text-xs">
            Follow the prompts to sign in. It may open a browser window to
            complete the authentication.
          </p>
          <Callout type="success" title="You'll know it worked when">
            Run <code className="text-[var(--s-accent-green)]">gh auth status</code> and
            you see your GitHub username and &ldquo;Logged in to github.com.&rdquo;
          </Callout>
          <Callout type="claude" title="After this, Claude handles git for you">
            You&apos;ll never need to memorize git commands. Just tell Claude
            &ldquo;commit and push this to GitHub&rdquo; or &ldquo;create a PR
            for this change.&rdquo; It handles everything.
          </Callout>
        </StepCard>

        {/* ═══ STEP 7: Vibe Code Starter Pack ═══ */}
        <StepCard stepNumber={7} title="Vibe Code Starter Pack" id="step-7" time="3 min">
          <p>
            This is Spencer&apos;s starter template — a real project with
            everything pre-configured so you can start building immediately.
            Clone it into your workspace:
          </p>
          <CodeBlock code={`cd ~\\Desktop\\AI-Builds\ngit clone https://github.com/campminder/vibe_coding_starter_pack.git\ncd vibe_coding_starter_pack`} />
          <p className="text-[var(--s-text-muted)] text-xs">
            This downloads the project to{" "}
            <code className="text-[var(--s-accent)]">~\Desktop\AI-Builds\vibe_coding_starter_pack</code>.
            It includes a CLAUDE.md, skills, and project structure already set
            up.
          </p>
          <p className="font-medium text-[var(--s-text-strong)]">Install dependencies and launch Claude:</p>
          <CodeBlock code={`npm install\ncam`} />
          <Callout type="success" title="You'll know it worked when">
            Claude launches in auto mode inside the starter pack folder. Ask
            it &ldquo;what project am I in?&rdquo; and it should describe the
            starter pack structure.
          </Callout>
        </StepCard>

        {/* ═══ STEP 8: The Workflow ═══ */}
        <StepCard stepNumber={8} title="The Workflow" id="step-8" time="Read: 3 min">
          <p>
            Instead of just chatting with Claude and hoping for the best, these
            commands give your conversations structure. Think of them like
            meeting agendas — they keep the AI focused on the right thing at the
            right time.
          </p>
          <p className="text-[var(--s-text-muted)] text-xs">
            These are slash commands you type inside a Claude Code session.
            They&apos;re built into the project — you don&apos;t install them.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                cmd: "/workflow-brainstorm",
                label: "Explore",
                desc: "Ask questions to understand what you're building before jumping in.",
                icon: Search,
              },
              {
                cmd: "/workflow-plan",
                label: "Design",
                desc: "Break the work into steps and decide how to build it.",
                icon: FileCode,
              },
              {
                cmd: "/workflow-work",
                label: "Build",
                desc: "Actually build the feature, writing tests along the way.",
                icon: Zap,
              },
              {
                cmd: "/workflow-review",
                label: "Review",
                desc: "Check the finished code for bugs, security issues, and quality.",
                icon: RefreshCw,
              },
              {
                cmd: "/workflow-compound",
                label: "Document",
                desc: "Write down what you learned so Claude remembers it next time.",
                icon: BookOpen,
              },
            ].map(({ cmd, label, desc, icon: Icon }) => (
              <div
                key={cmd}
                className="rounded-xl border border-[var(--s-card-border)] bg-[var(--s-card-bg)] p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[var(--s-accent)]" />
                  <code className="text-sm font-semibold text-[var(--s-accent)]">
                    {cmd}
                  </code>
                </div>
                <p className="text-xs font-medium text-[var(--s-text-muted)]">{label}</p>
                <p className="mt-1 text-xs text-[var(--s-text-dim)]">{desc}</p>
              </div>
            ))}
          </div>

          <Callout type="success" title="You'll know it worked when">
            Inside a Claude session, type{" "}
            <code className="text-[var(--s-accent-green)]">/workflow-brainstorm</code> and
            press Enter. Claude should ask you a structured set of questions
            about what you want to build.
          </Callout>
        </StepCard>

        {/* ═══ STEP 9: Skills & Sage ═══ */}
        <StepCard stepNumber={9} title="Skills & Sage" id="step-9" time="5 min">
          <p>
            Skills are instruction sets that make Claude an expert at specific
            tasks. Instead of explaining how you want something done every time,
            the skill handles it. Copy paste the commands below into Claude and
            tell it to execute — it&apos;ll download and install everything.
          </p>

          <p className="font-medium text-[var(--s-text-strong)]">Tell Claude:</p>
          <CodeBlock code={`Clone these repos into ~\\Desktop\\AI-Builds\\ and install all plugins and skills from them:\n\n1. https://github.com/campminder/cm-product-toolkit.git\n2. https://github.com/phuryn/pm-skills.git\n\nExecute these commands and confirm when done.`} />

          <p className="text-[var(--s-text-muted)] text-xs">
            The <strong className="text-[var(--s-text-body)]">CampMinder Product Toolkit</strong>{" "}
            includes <strong className="text-[var(--s-text-body)]">Sage</strong> — our
            product coaching AI. Type{" "}
            <code className="text-[var(--s-accent)]">/sage</code> or say &ldquo;coach
            me&rdquo; for product coaching on discovery, delivery, OKRs,
            JTBD, bets, and prioritization.
          </p>
          <p className="text-[var(--s-text-muted)] text-xs">
            The <strong className="text-[var(--s-text-body)]">PM Skills</strong> pack
            adds 40+ skills covering strategy, execution, go-to-market,
            marketing, PRDs, user stories, sprint planning, competitive
            analysis, and more.
          </p>

          <Callout type="success" title="You'll know it worked when">
            Claude confirms all plugins installed successfully.
          </Callout>

          <p className="font-medium text-[var(--s-text-strong)]">Try Sage:</p>
          <p className="text-[var(--s-text-muted)] text-xs">
            You&apos;ll likely need to restart your session for the new skills
            to load. Type{" "}
            <code className="text-[var(--s-accent)]">/exit</code>, then{" "}
            <code className="text-[var(--s-accent)]">cam</code> to relaunch
            (or <code className="text-[var(--s-accent)]">claude --resume</code>{" "}
            to pick up where you left off). Then try:
          </p>
          <CodeBlock code="/sage" />
          <Callout type="success" title="You'll know it worked when">
            Sage responds as your product coach. Try saying &ldquo;coach me on
            discovery&rdquo; and see what happens.
          </Callout>
        </StepCard>

        {/* ═══ STEP 10: Voice Mode ═══ */}
        <StepCard stepNumber={10} title="Voice Mode" id="step-10" time="1 min">
          <p>
            Voice mode lets you talk to Claude instead of typing. Inside a
            Claude session, type:
          </p>
          <CodeBlock code="/voice" />
          <p>
            Once enabled, hold the <strong className="text-[var(--s-text)]">spacebar</strong>{" "}
            to record. Release to send. Claude transcribes your speech and
            responds.
          </p>
          <p>Great for:</p>
          <ul className="list-inside space-y-1">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-purple-400/60" />
              Brainstorming while walking around
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-purple-400/60" />
              Dictating requirements hands-free
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-purple-400/60" />
              Quick iteration while looking at the browser — &ldquo;make the
              hero bigger&rdquo;, &ldquo;swap to dark mode&rdquo;
            </li>
          </ul>
          <Callout type="success" title="You'll know it worked when">
            After typing <code className="text-[var(--s-accent-green)]">/voice</code>,
            hold spacebar — you&apos;ll see a recording indicator. Release it
            and your spoken words appear as text input.
          </Callout>
          <Callout type="tip">
            Alternatively, you can use a tool like{" "}
            <strong className="text-[var(--s-text-strong)]">Whisper</strong> for
            speech-to-text, or connect with Spencer — he built a voice tool
            and can help you get it into your system.
          </Callout>
        </StepCard>

        {/* ═══ STEP 11: Vercel ═══ */}
        <StepCard stepNumber={11} title="Vercel" id="step-11" time="2 min">
          <p>
            Vercel takes your code and puts it on the internet. When you push
            changes to GitHub, Vercel automatically updates the live site within
            seconds — no manual steps. We use it because it&apos;s built for
            Next.js (our framework) and requires zero server setup.
          </p>
          <p className="text-[var(--s-text-muted)] text-xs">
            If you&apos;re inside a Claude session, type{" "}
            <code className="text-[var(--s-accent)]">/exit</code> first, then run
            these in a regular terminal tab.
          </p>
          <CodeBlock code="npm install -g vercel" />
          <CodeBlock code="vercel login" />
          <p className="text-[var(--s-text-muted)] text-xs">
            On Windows, run <code className="text-[var(--s-accent)]">vercel login</code>{" "}
            directly in PowerShell (no <code className="text-[var(--s-accent)]">!</code>{" "}
            prefix needed — that&apos;s a Claude session feature).
          </p>
          <p className="text-[var(--s-text-muted)] text-xs">
            This opens a browser window to sign in. Use your GitHub account
            for the simplest setup.
          </p>
          <Callout type="success" title="You'll know it worked when">
            Run <code className="text-[var(--s-accent-green)]">vercel whoami</code> and it
            prints your Vercel username.
          </Callout>
          <Callout type="claude" title="Let Claude deploy for you">
            Tell Claude &ldquo;deploy this to Vercel&rdquo; and it runs the
            right commands. For ongoing projects, connect the GitHub repo to
            Vercel via the dashboard — then every push to main auto-deploys.
          </Callout>
        </StepCard>

        {/* ═══ STEP 12: Status Bar ═══ */}
        <StepCard stepNumber={12} title="Status Bar" id="step-12" time="1 min">
          <p>
            Before we start building, let&apos;s set up your status bar so you
            can always see what&apos;s happening — which branch you&apos;re on,
            how many tokens you&apos;ve used, and how much context is left.
          </p>
          <p>Inside a Claude session, say:</p>
          <CodeBlock code={`Add information to my status bar: show the current git branch, the percentage of tokens used, and the percentage of context used.`} />
          <Callout type="success" title="You'll know it worked when">
            Your terminal status bar updates to show branch name, token usage,
            and context usage. These update in real time as you work.
          </Callout>
          <Callout type="warning" title="When context hits ~80%, use /compact">
            As you work, the context window fills up with conversation history.
            When it gets to around 80%, Claude starts slowing down and giving
            worse responses. Type{" "}
            <code className="text-[var(--s-accent)]">/compact</code> to compress
            the conversation — Claude keeps the important context but frees up
            space so you can keep building.
          </Callout>
        </StepCard>

        {/* ═══ STEP 13: Your First Prototype ═══ */}
        <StepCard stepNumber={13} title="Your First Prototype" id="step-13" time="28 min">
          <p className="font-medium text-[var(--s-text-strong)] text-base">The exercise</p>
          <p>
            Give prompt guidance, not identical prompts. Each person writes
            their own and observes how variation in description leads to
            different results.
          </p>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-5 space-y-3">
            <p className="text-[var(--s-text-body)]">
              Think of something small and concrete that relates to your product
              area. Not a full feature — a single screen or interaction. Some
              examples:
            </p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-purple-400/60" />
                A dashboard showing [your metric] with filters for [your segments]
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-purple-400/60" />
                A form that collects [specific inputs] and shows a confirmation
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-purple-400/60" />
                A simple table view of [data you work with] with sort and search
              </li>
            </ul>
            <p className="text-[var(--s-text-muted)] text-xs">
              If you need a starting point, here are a few real problems from Aha:
            </p>
            <ul className="space-y-1.5 text-xs text-[var(--s-text-muted)]">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange-400/60" />
                Camps can&apos;t see which families on the waitlist are most
                likely to convert, or quickly notify them when a spot opens
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange-400/60" />
                Camp directors have no quick way to see which cabins are over or
                under capacity across sessions
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange-400/60" />
                Billing staff can&apos;t see at a glance which families have
                outstanding balances, how overdue they are, and what the total
                exposure is
              </li>
            </ul>
            <p className="text-[var(--s-text-muted)] text-xs italic">
              Describe it to Claude the way you&apos;d describe it to a smart
              intern who&apos;s never seen Campminder. Be specific about what
              data should appear. Use plain English.
            </p>
          </div>

          <p className="font-medium text-[var(--s-text-strong)]">1. Create your project folder:</p>
          <p className="text-[var(--s-text-muted)] text-xs">
            If you&apos;re inside a Claude session, type{" "}
            <code className="text-[var(--s-accent)]">/exit</code> first.
          </p>
          <CodeBlock code={`cd ~\\Desktop\\AI-Builds\nmkdir my-prototype\ncd my-prototype`} />
          <p className="text-[var(--s-text-muted)] text-xs">
            Replace <code className="text-[var(--s-accent)]">my-prototype</code> with
            whatever name fits your idea (e.g.,{" "}
            <code className="text-[var(--s-accent)]">waitlist-dashboard</code> or{" "}
            <code className="text-[var(--s-accent)]">cabin-capacity</code>).
          </p>

          <p className="font-medium text-[var(--s-text-strong)]">2. Create a GitHub repo and connect to Vercel:</p>
          <p className="text-[var(--s-text-muted)] text-xs">
            Launch Claude in your new folder and let it handle the setup:
          </p>
          <CodeBlock code="cam" />
          <p>Then tell Claude:</p>
          <CodeBlock code={`Initialize this as a Next.js project, create a GitHub repo for it, and connect it to Vercel so it auto-deploys on push.`} />

          <p className="font-medium text-[var(--s-text-strong)]">3. Set up Neon (your database):</p>
          <p>Still inside Claude, say:</p>
          <CodeBlock code={`Set up a Neon Postgres database for this project through the Vercel integration. Name the database "[Your Name] - [project name]" (e.g. "Anna - waitlist-dashboard"). Save the connection string in .env.local.`} />
          <Callout type="info">
            Every database needs your name attached so the team can tell whose
            is whose. Use the Vercel Neon integration — not neon.tech directly —
            so the database is linked to your Vercel project automatically.
          </Callout>

          <p className="font-medium text-[var(--s-text-strong)]">4. Brainstorm:</p>
          <CodeBlock code="/brainstorm-ideas-new" />
          <p className="text-[var(--s-text-muted)] text-xs">
            This skill (from the PM Skills pack) helps you shape your idea from
            PM, Designer, and Engineer perspectives. Describe your prototype
            idea and Claude will ask clarifying questions. Then bring in Sage
            for product coaching:
          </p>
          <CodeBlock code="/sage" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Sage will coach you on the product angle — is this the right scope?
            What&apos;s the job to be done? What should V1 actually include?
          </p>

          <p className="font-medium text-[var(--s-text-strong)]">5. Plan:</p>
          <p className="text-[var(--s-text-muted)] text-xs">
            Once you&apos;re feeling good about the brainstorm, move to planning:
          </p>
          <CodeBlock code="/workflow-plan" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Claude will create an implementation plan. Then use this hot tip:
          </p>
          <Callout type="tip" title="Hot tip: the senior engineer review">
            After the plan is generated, tell Claude: &ldquo;Imagine you&apos;re
            a senior software engineer with 20 years of experience. Review this
            plan and make any updates.&rdquo; This catches gaps and raises the
            quality significantly.
          </Callout>

          <p className="font-medium text-[var(--s-text-strong)]">6. Build:</p>
          <CodeBlock code="/workflow-work" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Claude builds the prototype. When it&apos;s done, run the same
            review trick:
          </p>
          <Callout type="tip">
            &ldquo;Imagine you&apos;re a senior software engineer with 20 years
            of experience. Review this build and make any updates.&rdquo;
          </Callout>

          <p className="font-medium text-[var(--s-text-strong)]">7. Design pass:</p>
          <p>Then level up the UI:</p>
          <CodeBlock code={`Imagine you're a senior designer with 20 years of experience making a UX/UI update to this flow. Create tasks for yourself and then handle the tasks as you go.`} />

          <p className="font-medium text-[var(--s-text-strong)]">8. Sage check:</p>
          <p className="text-[var(--s-text-muted)] text-xs">
            Have Sage take another look at the product:
          </p>
          <CodeBlock code="/sage" />

          <p className="font-medium text-[var(--s-text-strong)]">9. Iterate:</p>
          <p>
            Keep iterating until you feel like you&apos;ve hit a good enough
            spot. Talk to Claude in plain English — &ldquo;make the header
            smaller&rdquo;, &ldquo;add a filter for date range&rdquo;,
            &ldquo;the table needs a loading state.&rdquo;
          </p>

          <p className="font-medium text-[var(--s-text-strong)]">10. Ship it:</p>
          <p>
            When you&apos;re ready, tell Claude:
          </p>
          <CodeBlock code="Commit and push to main" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Vercel auto-deploys on push — you&apos;ll have a live URL within
            seconds. Share it in Slack.
          </p>

          <p className="font-medium text-[var(--s-text-strong)]">11. Save what Claude learned:</p>
          <CodeBlock code="/workflow-review" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Reviews the code for quality and catches issues. Then:
          </p>
          <CodeBlock code="/workflow-compound" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Documents what Claude learned so it remembers next time you pick
            up this project.
          </p>

          <Callout type="success" title="You'll know it worked when">
            You have a running prototype on a live Vercel URL. Share it in
            Slack.
          </Callout>
        </StepCard>

        {/* ═══ YOU'RE DONE ═══ */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-6 text-center sm:p-8">
          <PartyPopper className="mx-auto mb-3 h-8 w-8 text-[var(--s-accent-green)]" />
          <h2 className="mb-2 text-lg font-semibold text-[var(--s-text)]">
            You&apos;re set up.
          </h2>
          <p className="mb-4 text-sm text-[var(--s-text-muted)]">
            Open Windows Terminal, navigate to a project folder, type{" "}
            <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-[var(--s-accent)]">cam</code>,
            and say: &ldquo;Hello — what can you help me build?&rdquo;
          </p>
          <p className="text-xs text-[var(--s-text-dim)]">
            From here, the workflow is: describe what you want, Claude builds
            it, you iterate together.
          </p>
        </div>

        {/* ═══ HOT TIPS ═══ */}
        <div className="mt-12 rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-6 sm:p-8">
          <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-[var(--s-text)]">
            <Flame className="h-4 w-4 text-orange-500" />
            Hot Tips
          </h2>
          <p className="mb-5 text-sm text-[var(--s-text-muted)]">
            Useful commands the team has found. Add yours below.
          </p>
          <HotTips tips={tips} />
        </div>

        {/* ═══ POST-MEETING: winget & Chocolatey ═══ */}
        <div className="mt-12 rounded-2xl border border-[var(--s-card-border)] bg-[var(--s-card-bg)] p-6 sm:p-8">
          <h2 className="mb-1 text-base font-semibold text-[var(--s-text)]">
            After the session: package managers on Windows
          </h2>
          <p className="mb-4 text-sm text-[var(--s-text-muted)]">
            Windows has two popular package managers that work like an app store
            for developer tools. You type one command and they handle the rest.
          </p>
          <p className="font-medium text-sm text-[var(--s-text-strong)]">winget (built in):</p>
          <p className="text-sm text-[var(--s-text-body)]">
            Windows 10 (1709+) and Windows 11 ship with{" "}
            <code className="text-[var(--s-accent)]">winget</code> built in.
            Check by running:
          </p>
          <CodeBlock code="winget --version" />
          <p className="text-sm text-[var(--s-text-body)]">
            If you see a version number, you&apos;re set. Use it to install tools like:
          </p>
          <CodeBlock code={`winget install Git.Git\nwinget install OpenJS.NodeJS.LTS\nwinget install Microsoft.WindowsTerminal`} />

          <p className="font-medium text-sm text-[var(--s-text-strong)] mt-4">Chocolatey (alternative):</p>
          <p className="text-sm text-[var(--s-text-body)]">
            <a
              href="https://chocolatey.org/install"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--s-accent)] underline decoration-[var(--s-accent)]/30 underline-offset-2 hover:decoration-[var(--s-accent)]"
            >
              Chocolatey
            </a>{" "}
            is a third-party package manager with a larger catalog. Install it
            from an elevated (Administrator) PowerShell:
          </p>
          <CodeBlock
            code={`Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`}
          />
          <p className="text-[var(--s-text-muted)] text-xs">
            After installation, you can use{" "}
            <code className="text-[var(--s-accent)]">choco install</code> to add tools.
            For example:{" "}
            <code className="text-[var(--s-accent)]">choco install nodejs-lts</code> or{" "}
            <code className="text-[var(--s-accent)]">choco install git</code>.
          </p>
          <Callout type="info">
            Most of the time, <code className="text-[var(--s-accent)]">winget</code>{" "}
            is all you need. Use Chocolatey if a specific tool isn&apos;t
            available through winget.
          </Callout>
        </div>

        {/* ═══ POST-MEETING: MCP Connections ═══ */}
        <div className="mt-8 rounded-2xl border border-[var(--s-card-border)] bg-[var(--s-card-bg)] p-6 sm:p-8">
          <h2 className="mb-1 text-base font-semibold text-[var(--s-text)]">
            After the session: connect your tools with MCP
          </h2>
          <p className="mb-4 text-sm text-[var(--s-text-muted)]">
            MCP connections let Claude search your Slack, check your calendar,
            read Notion pages, and more — without you copy-pasting anything.
            Type{" "}
            <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-[var(--s-accent)]">/mcp</code>{" "}
            inside a Claude session to start connecting your tools one at a time.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "Notion", "Slack", "Gmail", "Google Calendar",
              "Pendo", "Chrome Automation", "Azure DevOps", "Context7",
            ].map((name) => (
              <div key={name} className="rounded-lg border border-[var(--s-card-border)] bg-[var(--s-card-bg)] px-3 py-2">
                <span className="text-xs text-[var(--s-text-muted)]">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ CONTINUED LEARNING: Worktrees & Branches ═══ */}
        <div className="mt-8 rounded-2xl border border-[var(--s-card-border)] bg-[var(--s-card-bg)] p-6 sm:p-8">
          <h2 className="mb-1 text-base font-semibold text-[var(--s-text)]">
            Continued learning: worktrees &amp; branches
          </h2>
          <p className="mb-4 text-sm text-[var(--s-text-muted)]">
            Once you&apos;re comfortable with the basic workflow, worktrees let
            you experiment without risking your working prototype. A worktree is
            a separate copy of your project where Claude can try something bold —
            if it works, you merge it in. If not, you throw it away.
          </p>
          <p className="font-medium text-sm text-[var(--s-text-strong)]">Try it:</p>
          <CodeBlock code={`claude --worktree "experiment-name"`} />
          <p className="text-[var(--s-text-muted)] text-xs">
            This creates an isolated copy of your project on a new branch.
            Claude works there without touching your main code. When you&apos;re
            happy with the result, merge it into main. If it didn&apos;t work
            out, the worktree gets cleaned up automatically.
          </p>
          <p className="text-[var(--s-text-muted)] text-xs">
            This is how you go from &ldquo;one thing at a time&rdquo; to
            running multiple experiments in parallel — each in its own worktree,
            each safe from the others.
          </p>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[var(--s-card-border)] py-12 text-center">
        <p className="text-sm text-[var(--s-text)]/30">Built with Claude Code</p>
        <p className="mt-1 text-xs text-[var(--s-text)]/20">
          Build to Learn — Anna Goncharova
        </p>
      </footer>
    </div>
  );
}
