"use client";

import { useState, useEffect } from "react";
import { SetupNav } from "./setup-nav";
import { SetupHero } from "./setup-hero";
import { StepCard } from "./step-card";
import { CodeBlock } from "./code-block";
import { Callout } from "./callout";
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
} from "lucide-react";

const TOTAL_STEPS = 11;

export function SetupGuide() {
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
            created by the platform team. You just need a Mac and an internet
            connection.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-24 sm:px-6">
        {/* ═══ STEP 1: cmux Terminal ═══ */}
        <StepCard stepNumber={1} title="cmux Terminal" id="step-1" time="2 min">
          <p>
            Your Mac has a built-in Terminal app, but it wasn&apos;t designed
            for working alongside AI. cmux is — it shows you which AI sessions
            are waiting for your input, lets you run multiple sessions side by
            side, and sends you a notification when Claude finishes a long task
            so you don&apos;t have to babysit.
          </p>
          <p className="font-medium text-[var(--s-text-strong)]">Download and install:</p>
          <p>
            <a
              href="https://github.com/manaflow-ai/cmux/releases/latest/download/cmux-macos.dmg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--s-accent)] underline decoration-[var(--s-accent)]/30 underline-offset-2 hover:decoration-[var(--s-accent)]"
            >
              Download the DMG from GitHub &rarr;
            </a>
          </p>
          <p className="text-[var(--s-text-muted)] text-xs">
            Open the DMG file and drag cmux into your Applications folder.
            If you have Homebrew, you can also run{" "}
            <code className="text-[var(--s-accent)]">brew install --cask cmux</code>.
          </p>
          <Callout type="success" title="You'll know it worked when">
            Open cmux from your Applications folder. You should see a terminal
            window with a vertical tab sidebar on the left side.
          </Callout>
        </StepCard>

        {/* ═══ STEP 2: Node.js ═══ */}
        <StepCard stepNumber={2} title="Node.js" id="step-2" time="1 min">
          <p>
            Node.js is the engine that makes Claude Code and all our web
            projects run. You won&apos;t interact with it directly — it just
            needs to be installed on your Mac.
          </p>
          <p className="font-medium text-[var(--s-text-strong)]">Check if you already have it:</p>
          <CodeBlock code="node -v" />
          <p>
            If you see{" "}
            <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-[var(--s-accent-green)]">v20</code>{" "}
            or higher (e.g., v22.14.0 or v24.13.0), skip to Step 3. Otherwise:
          </p>
          <p>
            If you have Homebrew installed:
          </p>
          <CodeBlock code="brew install node" />
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
          <Callout type="success" title="You'll know it worked when">
            <code className="text-[var(--s-accent-green)]">node -v</code> prints a version
            number like <code className="text-[var(--s-accent-green)]">v22.14.0</code>, and{" "}
            <code className="text-[var(--s-accent-green)]">npm -v</code> also prints a
            number (npm is a tool that comes bundled with Node automatically).
          </Callout>
        </StepCard>

        {/* ═══ STEP 3: Claude Code ═══ */}
        <StepCard stepNumber={3} title="Claude Code" id="step-3" time="2 min">
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
            your Mac.
          </p>
          <p>
            If you get a permission error (you&apos;ll see the word{" "}
            <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-red-400">EACCES</code>{" "}
            — this is common on fresh Macs), use this alternative instead:
          </p>
          <CodeBlock code="npx @anthropic-ai/claude-code" />
          <p className="font-medium text-[var(--s-text-strong)]">Now launch it:</p>
          <p>
            Type <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-[var(--s-accent)]">claude</code>{" "}
            and press Enter. The first time, it will open a browser window where
            you sign in with your Anthropic account. After you sign in, go back
            to your terminal.
          </p>
          <Callout type="success" title="You'll know it worked when">
            Your terminal shows an interactive session with a{" "}
            <code className="text-[var(--s-accent-green)]">&gt;</code> prompt waiting for
            your input. Type &ldquo;hello&rdquo; — Claude should respond. Type{" "}
            <code className="text-[var(--s-accent-green)]">/exit</code> to leave when done.
          </Callout>
          <Callout type="info">
            Claude reads every file in the folder where you launch it. In the
            future, always navigate to your project folder first (e.g.,{" "}
            <code className="text-[var(--s-accent)]">cd ~/AI/my-project</code>) before
            running <code className="text-[var(--s-accent)]">claude</code>. Let&apos;s
            move onto the next step and get this done.
          </Callout>
        </StepCard>

        {/* ═══ STEP 4: Your Workspace ═══ */}
        <StepCard stepNumber={4} title="Your Workspace" id="step-4" time="2 min">
          <p>
            A dedicated folder keeps your AI projects organized, and one
            shortcut gets you into Claude with auto mode on — meaning Claude
            acts autonomously instead of asking permission for every step.
          </p>

          <p>
            <strong className="text-[var(--s-text-body)]">1. Create your workspace folder:</strong>
          </p>
          <CodeBlock code="mkdir -p ~/AI" />
          <p className="text-[var(--s-text-muted)] text-xs">
            This creates a folder called &ldquo;AI&rdquo; in your home
            directory. All your projects will live here.
          </p>

          <p>
            <strong className="text-[var(--s-text-body)]">2. Add the CAM shortcut:</strong>
          </p>
          <p className="text-[var(--s-text-muted)] text-xs">
            Your Mac has a hidden settings file called{" "}
            <code className="text-[var(--s-accent)]">~/.zshrc</code> that runs every
            time you open a terminal. Open it:
          </p>
          <CodeBlock code="open -a TextEdit ~/.zshrc" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Add this line at the bottom of the file, then save and close:
          </p>
          <CodeBlock
            code={`alias cam="claude --permission-mode auto"  # Claude Auto Mode`}
          />
          <p>Then reload your terminal settings:</p>
          <CodeBlock code="source ~/.zshrc" />

          <Callout type="info">
            <strong className="text-[var(--s-text-strong)]">CAM</strong> = Claude Auto Mode.
            When you type <code className="text-[var(--s-accent)]">cam</code>, Claude
            launches and handles file edits, commands, and tool calls without
            stopping to ask. Navigate to your project folder first, then
            type <code className="text-[var(--s-accent)]">cam</code>.
          </Callout>
          <Callout type="success" title="You'll know it worked when">
            <code className="text-[var(--s-accent-green)]">cd ~/AI && cam</code> launches
            Claude in auto mode. You&apos;ll see it start working without
            permission prompts.
          </Callout>
        </StepCard>

        {/* ═══ STEP 5: GitHub ═══ */}
        <StepCard stepNumber={5} title="GitHub" id="step-5" time="3 min">
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
          <CodeBlock code="brew install gh git" />
          <p className="text-[var(--s-text-muted)] text-xs">
            <code className="text-[var(--s-accent)]">git</code> is the version control
            tool that tracks changes.{" "}
            <code className="text-[var(--s-accent)]">gh</code> is GitHub&apos;s helper
            that makes it easier to create pull requests and manage your code
            from the terminal.
          </p>
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

        {/* ═══ STEP 6: Vibe Code Starter Pack ═══ */}
        <StepCard stepNumber={6} title="Vibe Code Starter Pack" id="step-6" time="3 min">
          <p>
            This is Spencer&apos;s starter template — a real project with
            everything pre-configured so you can start building immediately.
            Clone it into your workspace:
          </p>
          <CodeBlock code={`cd ~/AI\ngit clone https://github.com/campminder/vibe_coding_starter_pack.git\ncd vibe_coding_starter_pack`} />
          <p className="text-[var(--s-text-muted)] text-xs">
            This downloads the project to{" "}
            <code className="text-[var(--s-accent)]">~/AI/vibe_coding_starter_pack</code>.
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

        {/* ═══ STEP 7: The Workflow ═══ */}
        <StepCard stepNumber={7} title="The Workflow" id="step-7" time="Read: 3 min">
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

        {/* ═══ STEP 8: Skills & Sage ═══ */}
        <StepCard stepNumber={8} title="Skills & Sage" id="step-8" time="5 min">
          <p>
            Skills are instruction sets that make Claude an expert at specific
            tasks. Instead of explaining how you want something done every time,
            the skill handles it. We&apos;ll install three skill packs:
          </p>

          <p className="font-medium text-[var(--s-text-strong)]">1. CampMinder Product Toolkit (includes Sage):</p>
          <CodeBlock code={`cd ~/AI\ngit clone https://github.com/campminder/cm-product-toolkit.git`} />
          <p className="text-[var(--s-text-muted)] text-xs">
            This includes <strong className="text-[var(--s-text-body)]">Sage</strong> — our
            product coaching AI. Type{" "}
            <code className="text-[var(--s-accent)]">/sage</code> or say &ldquo;coach
            me&rdquo; to get product coaching on discovery, delivery, OKRs,
            JTBD, bets, and prioritization.
          </p>

          <p className="font-medium text-[var(--s-text-strong)]">2. PM Skills (40+ product management skills):</p>
          <CodeBlock code="git clone https://github.com/phuryn/pm-skills.git" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Covers discovery, strategy, execution, go-to-market, and marketing.
            PRDs, user stories, sprint planning, competitive analysis, pricing
            strategies, and more.
          </p>

          <Callout type="info">
            The Vibe Code Starter Pack (Step 5) already has its own built-in
            skills. These repos give you additional capabilities you can use
            across any project.
          </Callout>
          <Callout type="success" title="You'll know it worked when">
            Open Claude in the cm-product-toolkit folder and type{" "}
            <code className="text-[var(--s-accent-green)]">/sage</code>. Sage should
            respond as your product coach.
          </Callout>
        </StepCard>

        {/* ═══ STEP 9: Voice Mode ═══ */}
        <StepCard stepNumber={9} title="Voice Mode" id="step-9" time="1 min">
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

        {/* ═══ STEP 10: Vercel ═══ */}
        <StepCard stepNumber={10} title="Vercel" id="step-10" time="2 min">
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

        {/* ═══ STEP 11: Your First Prototype ═══ */}
        <StepCard stepNumber={11} title="Your First Prototype" id="step-11" time="28 min">
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
          <CodeBlock code={`cd ~/AI\nmkdir my-prototype\ncd my-prototype`} />
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
          <CodeBlock code="/workflow-brainstorm" />
          <p className="text-[var(--s-text-muted)] text-xs">
            Describe your prototype idea. Claude will ask clarifying questions.
            Then bring in Sage for product coaching:
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
            Open cmux, navigate to a project folder, type{" "}
            <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-[var(--s-accent)]">cam</code>,
            and say: &ldquo;Hello — what can you help me build?&rdquo;
          </p>
          <p className="text-xs text-[var(--s-text-dim)]">
            From here, the workflow is: describe what you want, Claude builds
            it, you iterate together.
          </p>
        </div>

        {/* ═══ POST-MEETING: Homebrew ═══ */}
        <div className="mt-12 rounded-2xl border border-[var(--s-card-border)] bg-[var(--s-card-bg)] p-6 sm:p-8">
          <h2 className="mb-1 text-base font-semibold text-[var(--s-text)]">
            After the session: install Homebrew
          </h2>
          <p className="mb-4 text-sm text-[var(--s-text-muted)]">
            Homebrew is an App Store for developer tools. You type one command
            and it handles the rest. The initial install can take 15-20 minutes
            on a fresh Mac (Apple needs to download Command Line Tools), so
            do this when you have a few minutes.
          </p>
          <p className="font-medium text-sm text-[var(--s-text-strong)]">Check if you already have it:</p>
          <CodeBlock code="brew --version" />
          <p className="text-sm text-[var(--s-text-body)]">
            If you see a version number, you&apos;re done. If you see{" "}
            <code className="rounded bg-[var(--s-code-bg)] px-1.5 py-0.5 text-red-400">command not found</code>,
            install it:
          </p>
          <CodeBlock
            code={`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`}
          />
          <p className="text-[var(--s-text-muted)] text-xs">
            Paste this into your terminal and press Enter. It will ask for your
            Mac password — you won&apos;t see characters as you type,
            that&apos;s normal. If Apple prompts you to install Command Line
            Developer Tools, click Install and wait.
          </p>
          <Callout type="info">
            Once Homebrew is installed, you can use{" "}
            <code className="text-[var(--s-accent)]">brew install</code> to quickly
            add tools. For example:{" "}
            <code className="text-[var(--s-accent)]">brew install --cask cmux</code> or{" "}
            <code className="text-[var(--s-accent)]">brew install node</code>.
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
