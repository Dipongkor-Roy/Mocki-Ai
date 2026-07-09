"use client";

import Image from "next/image";
import FaqSection from "@/components/layout/FaqSection";
import { Zap, Linkedin, Twitch, Twitter } from 'react-feather';
import PageTitle2 from "@/components/ui/PageTitle2";
import TeamMember from "@/components/ui/TeamMember";
import PageTitle3 from "@/components/ui/PageTitle3";
import CounterSection from "@/components/ui/CounterSection";
import Brands from "@/components/ui/Brands";
import Button from "@/components/ui/Button";

export default function ContactPage() {

    return (
        <>
            <PageTitle2
                icon={Zap}
                label="our customer feedback"
                title="Our Story"
                subtitle="Empowering Businesses, One Solution at a Time"
                align="center"
                widthClass="xl:w-7/12 lg:w-9/12"
            />
            <div className="about-wrap lg:pb-20 pb-16">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-20 2xl:px-24">
                    <div className="grid md:grid-cols-2 grid-cols-1 justify-center gap-6 pb-16">
                        {/* left side */}
                        <div className="relative w-full h-[615px] rounded-xl">
                            <Image
                                src="/images/about-5.svg"
                                alt="banner"
                                fill
                                sizes="(max-width: 768px) 100vw,  (max-width: 1200px) 50vw,  33vw"
                                className="object-cover rounded-xl"
                                priority
                            />
                        </div>
                        {/* right side */}
                        <div className="space-y-6">
                            <div className="relative w-full h-[319px] rounded-xl">
                                <Image
                                    src="/images/about-6.svg"
                                    alt="banner"
                                    fill
                                    sizes="(max-width: 768px) 100vw,  (max-width: 1200px) 50vw,  33vw"
                                    className="object-cover rounded-xl"
                                    priority
                                />
                            </div>
                            <div className="w-full" data-aos="fade-up" data-aos-duration="400" data-aos-delay="0">
                                <div className="font-dm bg-cyan-gradient rounded-xl p-6 h-[275px] flex flex-col dark:bg-image-none dark:bg-gray-800">
                                    {/* Avatar group  */}
                                    <div className="flex -space-x-4">
                                        <Image
                                            src="/images/avatars/user.png"
                                            width={48}
                                            height={48}
                                            alt="member-avatar"
                                            className="w-11 h-11 rounded-full"
                                            loading="lazy"
                                        />
                                        <Image
                                            src="/images/avatars/user.png"
                                            width={48}
                                            height={48}
                                            alt="member-avatar"
                                            className="w-11 h-11 rounded-full"
                                            loading="lazy"
                                        />
                                        <Image
                                            src="/images/avatars/user.png"
                                            width={48}
                                            height={48}
                                            alt="member-avatar"
                                            className="w-11 h-11 rounded-full"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Text block */}
                                    <div className="mt-auto">
                                        <h3 className="text-gray-900 font-medium mb-1 text-[75px] leading-none">30x</h3>
                                        <p className="text-gray-900 text-[22px] leading-7 font-normal italic lg:w-2/3 mb-0 pe-2">Genuine feedback those who know us best.</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="grid md:grid-cols-2 grid-cols-1 justify-center gap-6">
                        <div className="w-full">
                            <h3 className="text-gray-900 font-semibold lg:text-[34px] leading-tight text-2xl lg:w-5/6 tracking-tight aos-init aos-animate">We built the growth platform we always wanted, so you dont have to. We are more than just a company</h3>
                        </div>
                        <div className="w-full space-y-6">
                            <p className="text-gray-600 text-[17px] font-medium max-w-xl lg:pr-8 px-0 aos-init aos-animate" data-aos="fade-up" data-aos-duration="300">
                                Get intent on data the accounts you want to target as well as emails, direct dials, and cell phones. Everything you need to close the deal is right at your fingertips. Do not risk losing your current customers because they are not aware of additional products or services you provide. Build your ultimate prospecting list and know when your prospects intent signals increase or decrease to optimize your pipeline.
                            </p>
                            <p className="text-gray-600 text-[17px] font-medium max-w-xl lg:pr-8 px-0 aos-init aos-animate" data-aos="fade-up" data-aos-duration="300">
                                Get intent on data the accounts you want to target as well as emails, direct dials, and cell phones. Everything you need to close the deal is right at your fingertips. Do not risk losing your current customers because they are not aware of additional products.
                            </p>
                            <div className="aos-init aos-animate" data-aos="fade-up" data-aos-delay="200" data-aos-duration="400">
                                <Button href="/about" label="Who we are" bgColor="bg-blue-600" textColor="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* counter */}
            <div className="counter-wrap lg:pb-24 pb-12 font-dm bg-home-one-gradient-banner relative lg:py-24 py-20">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-24 lg:pb-20 pb-12">
                    {/* title */}
                    <PageTitle3
                        badgeText=""
                        title="Trusted by 150,000+ content creators agencies"
                        subtitle="Quizzes are working for them — and they can for you too."
                        widthClass="xl:w-7/12 lg:w-2/3 mx-auto"
                        alignment="center"
                        padding="pb-16"
                        textColor=""
                    />
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                        <CounterSection textcolor="text-gray-900" target={22.5} suffix="k" duration={1000} subtitle="Higher Conversion Rates" />
                        <CounterSection textcolor="text-gray-900" target={65} preffix="+" suffix="m" duration={1000} subtitle="Backed by those who believe." />
                        <CounterSection textcolor="text-gray-900" target={99.2} preffix=">" suffix="%" duration={1000} subtitle="People who trust what we." />
                    </div>
                </div>
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-4">
                    <div className="bg-white rounded-xl pb-0 lg:py-4">
                        <Brands layout="flex" />
                    </div>
                </div>
            </div>

            <div className="team-wrap font-dm z-10">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-4 lg:py-24 py-20">
                    {/* page title */}
                    <PageTitle3
                        badgeText=""
                        title="Discover what customers expect and go beyond to amaze them"
                        subtitle="Join thousands who trust us for quality and lasting relationships"
                        widthClass="xl:w-7/12 lg:w-2/3 mx-auto"
                        alignment="center"
                        padding="pb-16"
                        textColor=""
                    />
                    <div className="grid xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6">
                        <TeamMember
                            name="Sophia Carter"
                            role="Founder and CEO of Exsit"
                            image="/images/member.svg"
                            socials={[
                                {
                                    href: "https://linkedin.com",
                                    label: "LinkedIn",
                                    colorClass: "text-cyan-500",
                                    icon: <Linkedin size={22} />,
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
                                    icon: <Twitter size={22} />,
                                },
                            ]}
                        />
                        <TeamMember
                            name="Medico Deo"
                            role="Founder and CEO of Exsit"
                            image="/images/member.svg"
                            socials={[
                                {
                                    href: "https://linkedin.com",
                                    label: "LinkedIn",
                                    colorClass: "text-cyan-500",
                                    icon: <Linkedin size={22} />,
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
                                    icon: <Twitter size={22} />,
                                },
                            ]}
                        />
                        <TeamMember
                            name="Goria Coast"
                            role="Founder and CEO of Exsit"
                            image="/images/member.svg"
                            socials={[
                                {
                                    href: "https://linkedin.com",
                                    label: "LinkedIn",
                                    colorClass: "text-cyan-500",
                                    icon: <Linkedin size={22} />,
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
                                    icon: <Twitter size={22} />,
                                },
                            ]}
                        />
                        <TeamMember
                            name="Emily Grace"
                            role="Founder and CEO of Exsit"
                            image="/images/member.svg"
                            socials={[
                                {
                                    href: "https://linkedin.com",
                                    label: "LinkedIn",
                                    colorClass: "text-cyan-500",
                                    icon: <Linkedin size={22} />,
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
                                    icon: <Twitter size={22} />,
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>

            <FaqSection />
        </>
    );
}
