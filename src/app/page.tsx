"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CtaSection from "@/components/layout/CtaSection";
import Accordion from "@/components/ui/Accordion";
import PageTitle3 from "@/components/ui/PageTitle3";
import Button from "@/components/ui/Button";

import TeamMember from "@/components/ui/TeamMember";
import BadgeLink from "@/components/ui/BadgeLink";
import Image from "next/image";
import CounterCarousel from "@/components/ui/MainSlider";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import testimonials from "@/data/testimonials.json";
import maincarsoul from "@/data/maincarsoul.json";
import HeroOne from "@/components/layout/Heroone";
import { Linkedin, Twitch } from "lucide-react";
import { Twitter, HelpCircle } from "react-feather";
import CounterSection from "@/components/ui/CounterSection";
import VideoBlock from "@/components/ui/VideoBlock";

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <Header />
      {/* Hero */}
      <HeroOne />
      {/* service wrap */}
      <section className="service-wrap lg:py-24 py-12">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 pb-0 lg:py-4 py-0">
          <div className="flex flex-wrap justify-between pb-16 gap-y-4">
            <PageTitle3
              badgeText=""
              title="Why you should practice your next interview with Mocki AI"
              subtitle="Reading tips won't calm your nerves before an interview. Speaking out loud, getting real feedback, and doing it again will."
              widthClass="w-full xl:w-6/12 lg:w-7/12"
              alignment="start"
              padding="pb-0"
            />
            <div className="lg:text-right mt-auto">
              <Button
                href="/dashboard"
                label="Try a mock interview"
                bgColor="bg-blue-600"
                textColor="text-white"
              />
            </div>
          </div>
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mb-6">
            <div
              className="w-full lg:col-span-2 overflow-hidden relative rounded-xl"
              data-aos-duration="400"
              data-aos="fade-up"
            >
              {/* slider */}
              <CounterCarousel slides={maincarsoul} />
            </div>
            <div className="w-full" data-aos-duration="400" data-aos="fade-up">
              <div className="overflow-hidden relative rounded-xl h-[350px]">
                <Image
                  src="/images/home-bg-3.svg"
                  alt="about"
                  width={416}
                  height={350}
                  loading="lazy"
                  className="mx-auto hover:scale-[1.1] transition-all duration-[1s]"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.5)_100%)]"></div>

                <div className="absolute bottom-0 left-0 w-full p-5 z-10">
                  <div className="flex flex-row justify-between px-2">
                    <div>
                      <h3 className="text-white text-6xl font-medium mb-1">
                        9
                      </h3>
                      <p className="text-gray-200 font-medium text-lg leading-6 mb-0 xl:pr-12">
                        Real interview questions per session, answered out loud.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mb-6">
            <div className="w-full" data-aos-duration="400" data-aos="fade-up">
              <div className="bg-cyan-gradient dark:bg-gray-800 dark:bg-image-none rounded-xl p-5 flex flex-col h-[350px]">
                {/* Avatar group */}
                <div className="flex -space-x-3 flex-row">
                  <div className="w-11 h-11 rounded-full overflow-hidden">
                    <Image
                      src="/images/avatars/user.png"
                      alt="about"
                      width={50}
                      height={50}
                      loading="lazy"
                    />
                  </div>
                  <div className="w-11 h-11 rounded-full overflow-hidden">
                    <Image
                      src="/images/avatars/user.png"
                      alt="about"
                      width={50}
                      height={50}
                      loading="lazy"
                    />
                  </div>
                  <div className="w-11 h-11 rounded-full overflow-hidden">
                    <Image
                      src="/images/avatars/user.png"
                      alt="about"
                      width={50}
                      height={50}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Text block */}
                <div className="mt-auto">
                  <h3 className="text-gray-900  font-medium mb-1 text-[75px] leading-none">
                    AI
                  </h3>
                  <p className="text-gray-900 text-2xl font-normal italic lg:pr-12 mb-0 pe-2">
                    Feedback from AI, not a generic script.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="w-full lg:col-span-2"
              data-aos="fade-up"
              data-aos-duration="400"
              data-aos-delay="0"
            >
              <div className="feedback-div h-full min-h-[350px] flex bg-gray-200 rounded-lg p-6 relative">
                <div className="flex-1">
                  <TestimonialCarousel testimonials={testimonials} />
                </div>
                <div className="w-[160px] flex-none justify-end hidden xl:flex">
                  <div className="mt-auto text-right p-3 pb-0">
                    <span className="lg:text-7xl text-5xl font-medium text-gray-900">
                      4.5
                    </span>
                    <div className="flex flex-row justify-end gap-1 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="bi bi-star-fill text-orange-500"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="bi bi-star-fill text-orange-500"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="bi bi-star-fill text-orange-500"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="bi bi-star-fill text-orange-500"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="bi bi-star-fill text-gray-500"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-900 font-medium mt-1 mb-0">
                      (2.3k + Reviews )
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* feature wrap */}
      <section className="feature-wrap lg:py-24 py-12 bg-home-one-feature dark:bg-gray-800 dark:bg-none">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 pb-0 lg:py-4 py-0">
          <div className="grid gap-4 gap-y-10 lg:grid-cols-2 sm:grid-cols-1">
            {/* left side */}
            <div
              className="w-full text-center aos-init aos-animate"
              data-aos="fade-up"
              data-aos-duration="400"
            >
              <div
                className="overflow-hidden rounded-xl image-zoom-onhover"
                data-aos="fade-up"
                data-aos-duration="400"
                data-aos-delay="200"
              >
                <Image
                  src="https://images.pexels.com/photos/7654119/pexels-photo-7654119.jpeg"
                  alt="feature"
                  width={650}
                  height={520}
                  loading="lazy"
                  className="mx-auto w-[650px] h-[520px] object-cover hover:scale-[1.1] transition-all duration-[1s]"
                />
              </div>
              <Image
                src="/images/text-icon-2.png"
                alt="text"
                width={238}
                height={70}
                loading="lazy"
                className="mt-4 mx-auto"
                data-aos="zoom-in"
                data-aos-duration="400"
                data-aos-delay="300"
              />
            </div>
            {/* right side */}
            <div className="w-full lg:pl-16 pr-0">
              <PageTitle3
                badgeText=""
                title="How a Mocki AI session works"
                subtitle="No typing, no scripts to memorize. Just you, a set of real questions, and honest feedback on how you actually sound."
                widthClass="w-full"
                alignment="start"
                padding="pb-0"
              />
              <div
                className="grid grid-cols-12 items-start gap-4 mt-10 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="400"
                data-aos-delay="200"
              >
                <div className="col-span-4 lg:col-span-4 xl:col-span-3">
                  <CounterSection
                    target={1}
                    layout="simple"
                    suffix=""
                    textcolor="text-gray-900"
                    duration={1000}
                  />
                </div>
                <div className="col-span-8 lg:col-span-8 xl:col-span-6">
                  <p className="text-gray-700 mb-3 text-lg font-medium">
                    Start a session and get 9 interview questions, one at a
                    time.
                  </p>
                  <Button
                    href="/dashboard"
                    label="Start now"
                    bgColor="transparent"
                    padding="px-0 py-0"
                    textColor="text-gray-900"
                  />
                </div>
              </div>
              <div
                className="grid grid-cols-12 items-start gap-4 mt-10 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="400"
                data-aos-delay="200"
              >
                <div className="col-span-4 lg:col-span-4 xl:col-span-3">
                  <CounterSection
                    target={2}
                    layout="simple"
                    suffix=""
                    textcolor="text-gray-900"
                    duration={1000}
                  />
                </div>
                <div className="col-span-8 lg:col-span-8 xl:col-span-6">
                  <p className="text-gray-700 mb-3 text-lg font-medium">
                    Answer each one out loud with your mic, just like a real
                    interview.
                  </p>
                  <Button
                    href="/dashboard"
                    label="Start now"
                    bgColor="transparent"
                    padding="px-0 py-0"
                    textColor="text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* team wrap */}
      <section className="lg:py-24 py-12 relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 pb-0 lg:py-4 py-0">
          <PageTitle3
            badgeText=""
            title="Every session, saved to your History"
            subtitle="Every mock interview and its report is kept, so you can look back, compare, and see yourself actually getting better."
            widthClass="w-full xl:w-2/3 lg:w-2/3 mx-auto"
            alignment="center"
            padding="pb-16"
          />

          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6">
            <TeamMember
              name="Revisit any report"
              role="Open past sessions and re-read the full feedback anytime."
              image="https://images.pexels.com/photos/7108589/pexels-photo-7108589.jpeg"
              imageWidth={500}
              imageHeight={490}
              socials={[
                {
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                  colorClass: "text-cyan-500",
                  icon: <Linkedin fill="cyan" strokeWidth={0} size={22} />,
                },
                {
                  href: "https://twitch.com",
                  label: "Twitch",
                  colorClass: "text-red-500",
                  icon: <Twitch size={22} />,
                },
                {
                  href: "https://twitter.com",
                  label: "Twitter",
                  colorClass: "text-gray-900",
                  icon: <Twitter fill="dark" strokeWidth={0} size={22} />,
                },
              ]}
            />
            <TeamMember
              name="Track your scores"
              role="See how your performance shifts from one attempt to the next."
              image="https://images.pexels.com/photos/8511936/pexels-photo-8511936.jpeg"
              imageWidth={500}
              imageHeight={490}
              socials={[
                {
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                  colorClass: "text-cyan-500",
                  icon: <Linkedin fill="cyan" strokeWidth={0} size={22} />,
                },
                {
                  href: "https://twitch.com",
                  label: "Twitch",
                  colorClass: "text-red-500",
                  icon: <Twitch size={22} />,
                },
                {
                  href: "https://twitter.com",
                  label: "Twitter",
                  colorClass: "text-gray-900",
                  icon: <Twitter fill="dark" strokeWidth={0} size={22} />,
                },
              ]}
            />
            <TeamMember
              name="Spot the pattern"
              role="Notice which types of questions keep tripping you up."
              image="https://images.pexels.com/photos/5466251/pexels-photo-5466251.jpeg"
              imageWidth={500}
              imageHeight={490}
              socials={[
                {
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                  colorClass: "text-cyan-500",
                  icon: <Linkedin fill="cyan" strokeWidth={0} size={22} />,
                },
                {
                  href: "https://twitch.com",
                  label: "Twitch",
                  colorClass: "text-red-500",
                  icon: <Twitch size={22} />,
                },
                {
                  href: "https://twitter.com",
                  label: "Twitter",
                  colorClass: "text-gray-900",
                  icon: <Twitter fill="dark" strokeWidth={0} size={22} />,
                },
              ]}
            />
            <TeamMember
              name="Practice with purpose"
              role="Walk into every new attempt already knowing what to fix."
              image="https://images.pexels.com/photos/5439455/pexels-photo-5439455.jpeg"
              imageWidth={500}
              imageHeight={490}
              socials={[
                {
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                  colorClass: "text-cyan-500",
                  icon: <Linkedin fill="cyan" strokeWidth={0} size={22} />,
                },
                {
                  href: "https://twitch.com",
                  label: "Twitch",
                  colorClass: "text-red-500",
                  icon: <Twitch size={22} />,
                },
                {
                  href: "https://twitter.com",
                  label: "Twitter",
                  colorClass: "text-gray-900",
                  icon: <Twitter fill="dark" strokeWidth={0} size={22} />,
                },
              ]}
            />
          </div>
        </div>
      </section>
      {/* feature wrap */}
      <section className="feature-wrap lg:py-24 py-12 bg-[#EBF1FF] dark:bg-gray-800 ">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 pb-0 lg:py-4 py-0">
          <div className="grid gap-4 gap-y-10 lg:grid-cols-2 sm:grid-cols-1">
            {/* left side */}
            <div className="lg:pr-12 pr-0">
              <PageTitle3
                badgeText=""
                title="Everything you need to practice like it's real"
                subtitle="Mocki AI is built around one idea: the more your practice feels like a real interview, the more confident you'll be when it counts."
                widthClass="w-full"
                alignment="start"
                padding="pb-0"
              />
              <div className="flex flex-wrap gap-2 mt-5">
                <BadgeLink label="Answer by speaking, not typing" />
                <BadgeLink label="AI-powered feedback" delay={100} />
                <BadgeLink label="Structured 9-question sessions" delay={200} />
                <BadgeLink label="Instant performance report" delay={200} />
                <BadgeLink label="Full session history saved" delay={300} />
              </div>
            </div>
            {/* right side */}
            <div className="w-full" data-aos="fade-up" data-aos-duration="400">
              <VideoBlock
                videoUrl="https://www.pexels.com/download/video/7426752/"
                thumbnail="https://images.pexels.com/photos/7643739/pexels-photo-7643739.jpeg"
                alt="About Us Video"
              />
            </div>
          </div>
        </div>
      </section>
      {/* faq wrap */}
      <div className="faq-wrap font-dm lg:py-24 py-12 bg-gray-gradient dark:bg-gray-800">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3">
          <div className="grid lg:grid-cols-12 xl:gap-24 gap-8">
            {/* Left Side */}
            <div className="xl:col-span-6 col-span-6 flex flex-col">
              <PageTitle3
                icon={<HelpCircle size={18} />}
                badgeText="Frequently Asked Questions"
                title="Questions you might have"
                subtitle="A few things people usually ask before their first session."
                widthClass="xl:w-10/12 lg:w-2/3 w-full"
                alignment="start"
                padding="pb-16"
              />
            </div>

            {/* Right Side (Accordion) */}
            <div className="lg:col-span-6 xl:pl-16">
              <Accordion
                defaultOpenIndex={0}
                items={[
                  {
                    question: "Is Mocki AI free to use?",
                    answer:
                      "Yes. This is a personal project built to help people practice interviews, not a paid product — so go ahead and use it freely.",
                  },
                  {
                    question: "Do I need to type any answers?",
                    answer:
                      "No. Every question is meant to be answered out loud using your microphone, just like a real interview conversation.",
                  },
                  {
                    question: "What kind of feedback will I get?",
                    answer:
                      "After your 9 questions, our AI reviews your actual spoken answers and gives you a report covering clarity, structure, relevance, and where you can improve.",
                  },
                  {
                    question: "Can I see my past interviews later?",
                    answer:
                      "Yes. Every completed session and its report is saved to your History, so you can revisit it or compare it against newer attempts anytime.",
                  },
                  {
                    question: "How many questions are in one session?",
                    answer:
                      "Each mock interview is a set of 9 questions, giving you a full, focused practice round without dragging on too long.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      {/* cta wrap */}
      <CtaSection
        title="Ready to practice out loud?"
        subtitle="Start a mock interview, answer with your voice, and get real feedback in minutes."
        firstButtonLabel="Start your first interview"
        secondButtonLabel="See how it works"
      />
      {/* footer */}
      <Footer />
    </>
  );
}
