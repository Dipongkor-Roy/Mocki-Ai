"use client";
import { Boxes } from "lucide-react";
import Button from "../ui/Button";
import PageTitle3 from "../ui/PageTitle3";
import Brands from "../ui/Brands";
import Image from "next/image";
import TopCarousel from "../ui/TopCarousel";

export default function HeroOne() {
  return (
    <div className="banner-wrap lg:pb-24 pb-12 font-dm bg-home-two-price relative pt-24">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 pb-0">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 lg:pt-10 relative z-10">
          {/* left side */}
          <div className="w-full items-center flex h-full xl:pr-8">
            <div className="flex flex-col ">
              {/* Badge */}
              <div>
                <span
                  className="inline-block py-2 px-3 rounded-full border border-gray-200 bg-white text-sm text-blue-600 font-medium aos-init aos-animate"
                  data-aos="fade-up"
                  data-aos-duration="200"
                >
                  ⚡ AI mock interviews are live
                </span>
              </div>

              {/* Heading */}
              <h1
                className="text-gray-900 font-semibold xl:text-[80px] lg:text-6xl text-5xl mt-2 mb-3 tracking-tighter aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="400"
              >
                {" "}
                Master your next{" "}
                <span className="text-blue-600">interview</span>
                <br />
                with AI{" "}
              </h1>
              <p
                className="font-medium text-gray-900 max-w-xl lg:pr-10 text-lg aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="500"
              >
                {" "}
                Get realistic, voice-based mock interviews tailored to your
                experience level. Receive production grade, instant feedback
                powered by AI.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-8 pb-3">
                <Button
                  href="/pricing"
                  label="Start trial for 14 days"
                  bgColor="bg-blue-600"
                  textColor="text-white"
                  padding="py-4 px-6"
                />
                <Button
                  href="/about"
                  label="Explore more"
                  bgColor="bg-gray-900"
                  textColor="text-gray-100"
                  padding="py-4 px-6"
                />
              </div>

              {/* Decorative Image */}
              <div
                data-aos="zoom-in"
                data-aos-duration="300"
                className="aos-init aos-animate"
              >
                <Image
                  src="/images/text-icon.png"
                  alt="text"
                  className="relative left-5"
                  width={299}
                  height={70}
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* right side */}
          <div className="w-full">
            <div
              className="relative rounded-xl lg:overflow-visible overflow-hidden aos-init aos-animate bg-transparent"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              {" "}
              {/* Main Image */}
              <div className="w-full aspect-[637/721] rounded-xl overflow-hidden ">
                <iframe
                  src="https://my.spline.design/interactiveaiwebsite-wtWdv2EaO3yGXzCOYmueDAms/"
                  width="100%"
                  height="100%"
                  style={{ backgroundColor: "transparent" }}
                ></iframe>
              </div>
              {/* Floating Icon */}
              <div className="absolute top-16 left-0 -translate-x-1/2 hidden lg:flex">
                <div className="w-16 h-16 rounded-xl bg-lime-300 flex items-center justify-center text-center">
                  <Boxes size={34} strokeWidth="1.5" />
                </div>
              </div>
              {/* Avatar Group */}
              <div
                className="absolute top-4 -right-8 bg-white rounded-xl border border-gray-200 shadow-sm p-3 gap-4 mt-4 hidden lg:flex flex-row items-center aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration="400"
                data-delay="400"
              >
                <div className="flex -space-x-4">
                  <Image
                    src="https://exsit-next.vercel.app/_next/image?url=%2Fimages%2Favatars%2Favater-12.webp&w=48&q=75"
                    width={48}
                    height={48}
                    alt="member-avatar"
                    className="w-11 h-11 rounded-full"
                    loading="lazy"
                  />
                  <Image
                    src="https://exsit-next.vercel.app/_next/image?url=%2Fimages%2Favatars%2Favater-11.webp&w=48&q=75"
                    width={48}
                    height={48}
                    alt="member-avatar"
                    className="w-11 h-11 rounded-full"
                    loading="lazy"
                  />
                  <Image
                    src="https://exsit-next.vercel.app/_next/image?url=%2Fimages%2Favatars%2Favater-13.webp&w=48&q=75"
                    width={48}
                    height={48}
                    alt="member-avatar"
                    className="w-11 h-11 rounded-full"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col leading-tight text-gray-900 font-semibold text-2xl">
                  {" "}
                  12.5k+{" "}
                  <span className="block text-base font-medium text-gray-800">
                    Mock Sessions Completed
                  </span>{" "}
                </div>
              </div>
              {/* topslider */}
              <TopCarousel
                items={[
                  "Affordable & scalable plans",
                  "Plans that fit every stage",
                  "Built to scale with your needs",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-20 pb-0 lg:pt-24 pt-12 py-0">
        <PageTitle3
          badgeText=""
          title="Trusted by 150,000+ content creators agencies"
          subtitle="Quizzes are working for them — and they can for you too."
          widthClass="w-full xl:w-2/3 lg:w-2/3 mx-auto"
          alignment="center"
          padding="pb-16"
        />
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          <Brands />
        </div>
      </div>
    </div>
  );
}
