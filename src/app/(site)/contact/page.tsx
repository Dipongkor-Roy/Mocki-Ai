"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Zap } from "react-feather";
import Brands from "@/components/ui/Brands";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // handle form logic here (send data via API route or 3rd party service)
    setSubmitted(true);
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-96 font-dm bg-light-blue-banner lg:pt-24 pt-12"></div>
      <div className="contact-wrap font-dm z-10 lg:pt-24 pt-12 z-20 relative">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 lg:py-24 py-20">
          <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-6 space-y-5 lg:space-y-0">
            {/* Left Side */}
            <div className="w-full lg:pr-16">
              <div className="flex">
                <div className="px-3 py-1 border border-gray-200 shadow-sm rounded-lg text-[13px] font-semibold uppercase text-blue-600 bg-white flex items-center gap-2">
                  <Zap size={18} className="text-blue-500" />
                  Get in touch
                </div>
              </div>

              <h2 className="xl:text-[80px] lg:text-5xl text-4xl lg:leading-[1] tracking-tight text-gray-900 font-bold mb-4 mt-3">
                Questions, bugs, or feedback?
              </h2>

              <p className="text-gray-700 font-medium text-base lg:pr-16">
                Mocki AI is a free, one-person project — send a message below or
                email{" "}
                <a
                  href="mailto:hello@mocki.ai"
                  className="underline text-blue-600"
                >
                  hello@mocki.ai
                </a>{" "}
                and I&apos;ll get back to you personally.
              </p>

              <h3 className="text-gray-400 font-medium text-lg lg:mt-24 mt-10">
                Built with
              </h3>

              <div className="bg-white rounded-xl mt-6 lg:py-4 py-2">
                <Brands layout="flex" />
              </div>
            </div>

            {/* Right Side (Form) */}
            <div className="w-full">
              <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-8 lg:p-10">
                <h4 className="text-gray-900 font-semibold lg:text-4xl text-3xl">
                  Send a message
                </h4>
                <p className="text-gray-600 font-medium text-[17px] lg:pr-5 mt-2">
                  Found a bug, have an idea, or just want to say hi? Drop a note
                  below.
                </p>

                <div className="mt-4 pt-6">
                  <form onSubmit={handleSubmit} id="contactForm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-gray-900 text-base font-medium mb-2"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="First Name"
                          required
                          className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-gray-900 text-base font-medium mb-2"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          placeholder="Last Name"
                          required
                          className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-gray-900 text-base font-medium mb-2"
                      >
                        Enter email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="phone"
                        className="block text-gray-900 text-base font-medium mb-2"
                      >
                        Phone number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+880 1XXX XXXXXX "
                        className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="message"
                        className="block text-gray-900 text-base font-medium mb-2"
                      >
                        Put the message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Found a bug, have a feature idea, or a question about a mock interview report?"
                        required
                        className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white text-base font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
                      >
                        <span>Send message</span>
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                    {submitted && (
                      <p className="bg-green-100 text-green-800 font-medium py-3 px-4  rounded-md mt-3">
                        Form submitted successfully!
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
