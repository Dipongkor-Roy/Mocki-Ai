// app/privacy/page.tsx
import Link from "next/link";
import PageTitle from "@/components/ui/PageTitle";

export const metadata = {
  title: "Privacy Policy - Mocki AI",
  description:
    "What data Mocki AI collects, why, and how it's used, in plain language.",
};

export default function PrivacyPage() {
  return (
    <>
      {/* Page Title */}
      <PageTitle
        title="Privacy Policy"
        subtitle="What we collect, why, and what we do with it no legal jargon."
      />
      <section className="term-wrap font-dm lg:pb-24 pb-12">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 lg:pt-24 pt-20">
          <div className="lg:w-7/12 mx-auto">
            {/* 1. What We Collect */}
            <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold">
              1. What We Collect
            </h2>
            <ul className="list-disc py-6 pl-5 mb-3 text-gray-800 font-medium text-[17px] leading-7">
              <li>
                <strong>Account info:</strong> your name and email address,
                collected when you sign in.
              </li>
              <li>
                <strong>Your CV:</strong> the file you upload, and the profile
                details (skills, experience, education) an AI model extracts
                from it.
              </li>
              <li>
                <strong>Interview data:</strong> the questions you were asked,
                the transcript of what you said, and the score/report generated
                from each session.
              </li>
              <li>
                <strong>Camera & microphone:</strong> used live, in your
                browser, to record your answer and transcribe your speech. See
                Section 3 for exactly what happens to this.
              </li>
            </ul>
            <p className="mb-8 text-gray-800 font-medium text-[17px] leading-7">
              That&apos;s the complete list. We don&apos;t track you across
              other websites, and we don&apos;t collect anything beyond
              what&apos;s needed to run the interview-practice feature itself.
            </p>

            {/* 2. Why We Collect It */}
            <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold">
              2. Why We Collect It
            </h2>
            <ul className="my-5 list-disc py-6 pl-5 text-gray-800 font-medium text-[17px] leading-7">
              <li>
                To identify your account and keep your data private to you.
              </li>
              <li>
                To generate interview questions and feedback tailored to your
                actual background.
              </li>
              <li>
                To save your past interviews and reports so you can revisit them
                in History and track improvement over time.
              </li>
            </ul>
            <p className="mb-8 text-gray-800 font-medium text-[17px] leading-7">
              We don&apos;t use your data for advertising, and there&apos;s no
              mailing list or marketing use of your information.
            </p>

            {/* 3. Camera, Microphone & AI Processing */}
            <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold mb-4">
              3. Camera, Microphone & AI Processing
            </h2>
            <p className="text-gray-800 font-medium text-[17px] leading-7">
              During a mock interview, your webcam is shown on-screen so the
              session feels real, and your microphone is used to speech-to-text
              your spoken answer directly in your browser. What actually gets
              sent to the AI for scoring is the <strong>text transcript</strong>{" "}
              of your answer, not a video or audio recording.
            </p>
            <p className="mb-8 text-gray-800 font-medium text-[17px] leading-7">
              We don&apos;t run facial-expression or voice-tone analysis on you.
              The &quot;confidence&quot; breakdown in your report is estimated
              from patterns in your answer text, not from analyzing your camera
              feed or voice.
            </p>

            {/* 4. Where Data Is Stored & Who Sees It */}
            <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold mb-4">
              4. Where Data Is Stored & Who Sees It
            </h2>
            <p className="text-gray-800 font-medium text-[17px] leading-7">
              Your account, CV, and interview data are stored in a private
              database used only by Mocki AI. A small number of trusted service
              providers help run the product behind the scenes, handling
              sign-in, processing your CV and interview text to generate
              questions and scores, and hosting the website, and your data
              passes through them only as needed to make those features work.
            </p>
            <p className="mb-8 text-gray-800 font-medium text-[17px] leading-7">
              We do not sell your data, and we do not share it with anyone
              beyond what&apos;s needed to run the product.
            </p>

            {/* 5. Your Rights */}
            <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-800 font-medium text-[17px] leading-7">
              You can remove your uploaded CV at any time from your Dashboard.
              To delete your account and all associated interview data entirely,
              or to ask what data is stored about you, contact us directly:
            </p>
            <p className="mb-8 text-gray-800 font-medium text-[17px] leading-7">
              <Link href="/contact" className="text-blue-600 underline">
                Reach out via the Contact page
              </Link>
              , and we&apos;ll action the request as soon as possible.
            </p>

            {/* 6. Changes to This Policy */}
            <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold mb-4">
              6. Changes to This Policy
            </h2>
            <p className="mb-8 text-gray-800 font-medium text-[17px] leading-7">
              As Mocki AI evolves, this page may be updated to reflect changes
              in what data is collected or how it&apos;s used. Since this is a
              small, actively-developed personal project, check back
              occasionally if you want the latest version.
            </p>

            {/* 7. Contact */}
            <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold mb-4">
              7. Contact
            </h2>
            <p className="text-gray-800 font-medium text-[17px] leading-7">
              Questions about this policy or your data? Get in touch via the{" "}
              <Link href="/contact" className="text-blue-600 underline">
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
