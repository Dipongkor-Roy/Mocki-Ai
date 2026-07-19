"use client";

import Image from "next/image";
import { Zap } from "react-feather";
import { Mic, Brain, History as HistoryIcon } from "lucide-react";
import PageTitle2 from "@/components/ui/PageTitle2";
import PageTitle3 from "@/components/ui/PageTitle3";
import Button from "@/components/ui/Button";

const HOW_IT_WORKS = [
  {
    icon: Mic,
    title: "Answer out loud",
    description:
      "No typing, no scripts. You get a real question and answer it with your voice and webcam, just like an actual interview.",
  },
  {
    icon: Brain,
    title: "AI reviews your answer",
    description:
      "Your spoken response is transcribed and scored on relevance, clarity, and confidence with specific feedback, not a generic score.",
  },
  {
    icon: HistoryIcon,
    title: "Track your progress",
    description:
      "Every session and its report is saved to your history, so you can revisit past attempts and see yourself actually improving.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageTitle2
        icon={Zap}
        label="About Mocki AI"
        title="Practice out loud, before it counts"
        subtitle="Mocki AI is a free tool for practicing interviews the way they actually happen — by speaking, not by reading."
        align="center"
        widthClass="xl:w-7/12 lg:w-9/12"
      />

      <div className="about-wrap lg:pb-20 pb-16">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-20 2xl:px-24">
          <div className="grid md:grid-cols-2 grid-cols-1 justify-center gap-6 pb-16">
            {/* left side */}
            <div className="relative w-full h-[615px] rounded-xl overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Practicing a mock interview at a laptop"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-xl"
                priority
              />
            </div>
            {/* right side */}
            <div className="space-y-6">
              <div className="relative w-full h-[319px] rounded-xl overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/4050347/pexels-photo-4050347.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Reviewing interview feedback on a laptop"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
              <div
                className="w-full"
                data-aos="fade-up"
                data-aos-duration="400"
                data-aos-delay="0"
              >
                <div className="font-dm bg-cyan-gradient rounded-xl p-6 h-[275px] flex flex-col dark:bg-image-none dark:bg-gray-800">
                  {/* Text block */}
                  <div className="mt-auto">
                    <h3 className="text-gray-900 font-medium mb-1 text-[75px] leading-none">
                      9
                    </h3>
                    <p className="text-gray-900 text-[22px] leading-7 font-normal italic lg:w-2/3 mb-0 pe-2">
                      Real interview questions per session — no shortcuts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 justify-center gap-6">
            <div className="w-full">
              <h3 className="text-gray-900 font-semibold lg:text-[34px] leading-tight text-2xl lg:w-5/6 tracking-tight">
                I built this because reading interview tips never calmed my
                nerves
              </h3>
            </div>
            <div className="w-full space-y-6">
              <p
                className="text-gray-600 text-[17px] font-medium max-w-xl lg:pr-8 px-0"
                data-aos="fade-up"
                data-aos-duration="300"
              >
                Every guide says the same thing: practice out loud. But there
                was never anywhere to actually do that on demand — so I built
                Mocki AI. You get a set of real interview questions tailored to
                your CV and target role, answer them with your own voice and
                camera, and get honest AI feedback on how you actually sounded.
              </p>
              <p
                className="text-gray-600 text-[17px] font-medium max-w-xl lg:pr-8 px-0"
                data-aos="fade-up"
                data-aos-duration="300"
              >
                It&apos;s a personal project, not a company — free to use, with
                no signup paywall and no sales pitch. Just a way to rehearse the
                real thing before it matters.
              </p>
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="400"
              >
                <Button
                  href="/dashboard"
                  label="Try a mock interview"
                  bgColor="bg-blue-600"
                  textColor="text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="counter-wrap lg:pb-24 pb-12 font-dm bg-home-one-gradient-banner relative lg:py-24 py-20">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-24">
          <PageTitle3
            badgeText=""
            title="How a Mocki AI session works"
            subtitle="Three steps, one full practice round — start to finished report."
            widthClass="xl:w-7/12 lg:w-2/3 mx-auto"
            alignment="center"
            padding="pb-16"
            textColor=""
          />
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
            {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-gray-100 h-full"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Principles */}
      <div className="team-wrap font-dm z-10">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-4 lg:py-24 py-20">
          <PageTitle3
            badgeText=""
            title="Why it's built this way"
            subtitle="A few choices that shaped Mocki AI, on purpose."
            widthClass="xl:w-7/12 lg:w-2/3 mx-auto"
            alignment="center"
            padding="pb-16"
            textColor=""
          />
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
            <div className="p-6 rounded-xl border border-gray-100 bg-white">
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                Voice-first, always
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Typing an answer trains a different skill than speaking one.
                Every question here is answered out loud, because that&apos;s
                what the real interview will demand.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-gray-100 bg-white">
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                Feedback, not just a score
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                A number alone doesn&apos;t help you improve. Every report
                breaks down strengths, gaps, and specific per-question feedback
                you can act on.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-gray-100 bg-white">
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                Free, no catch
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This is a personal project, not a SaaS. No paywall, no trial
                countdown — just a place to practice before the interview that
                actually matters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
