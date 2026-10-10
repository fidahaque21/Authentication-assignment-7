"use client";

import { Form, Input, Label, TextField, FieldError, Button } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

export function Basic() {
const [error, setError] = useState("");

const onSubmit = (e) => {
e.preventDefault();


const formData = new FormData(e.currentTarget);
const data = Object.fromEntries(formData.entries());

if (data.password !== data.confirmPassword) {
  setError("পাসওয়ার্ড দুটি মিলছে না।");
  return;
}

setError("");

alert(
  `অ্যাকাউন্ট তৈরি সফল!\n${JSON.stringify(
    {
      name: data.name,
      email: data.email,
    },
    null,
    2
  )}`
);


};

return ( <main className="min-h-screen bg-[#f1f5f0] px-4 py-8 sm:py-10"> <div className="mx-auto w-full max-w-[380px]">
{/* Heading */} <div className="mb-6 text-center"> <h1 className="text-2xl font-bold tracking-tight text-[#202923]">
অ্যাকাউন্ট তৈরি করুন </h1>

```
      <p className="mt-1 text-sm text-[#7b847c]">
        বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন
      </p>
    </div>

    {/* Form Card */}
    <div className="rounded-2xl border border-[#e0e8e0] bg-[#fbfcfa] p-5 shadow-sm sm:p-[22px]">
      <Form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
        {/* Name */}
        <TextField isRequired name="name">
          <Label className="mb-1.5 block text-sm font-semibold text-[#354039]">
            নাম
          </Label>

          <Input
            placeholder="যেমন: রহিম উদ্দিন"
            autoComplete="name"
            className="h-[38px] w-full rounded-lg border border-[#dfe7df] bg-transparent px-3 text-sm text-[#26332a] outline-none transition focus:border-[#07883e] focus:ring-2 focus:ring-[#07883e]/10"
          />

          <FieldError className="mt-1 text-xs text-red-600" />
        </TextField>

        {/* Email */}
        <TextField
          isRequired
          name="email"
          type="email"
          validate={(value) => {
            if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
            ) {
              return "সঠিক ইমেইল ঠিকানা লিখুন";
            }

            return null;
          }}
        >
          <Label className="mb-1.5 block text-sm font-semibold text-[#354039]">
            ইমেইল
          </Label>

          <Input
            placeholder="you@example.com"
            autoComplete="email"
            className="h-[38px] w-full rounded-lg border border-[#dfe7df] bg-transparent px-3 text-sm text-[#26332a] outline-none transition focus:border-[#07883e] focus:ring-2 focus:ring-[#07883e]/10"
          />

          <FieldError className="mt-1 text-xs text-red-600" />
        </TextField>

        {/* Password */}
        <TextField
          isRequired
          name="password"
          type="password"
          minLength={8}
          validate={(value) => {
            if (value.length < 8) {
              return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
            }

            if (!/[A-Z]/.test(value)) {
              return "কমপক্ষে একটি বড় হাতের ইংরেজি অক্ষর দিন";
            }

            if (!/[0-9]/.test(value)) {
              return "কমপক্ষে একটি সংখ্যা দিন";
            }

            return null;
          }}
        >
          <Label className="mb-1.5 block text-sm font-semibold text-[#354039]">
            পাসওয়ার্ড
          </Label>

          <Input
            placeholder="কমপক্ষে ৮ অক্ষর"
            autoComplete="new-password"
            className="h-[38px] w-full rounded-lg border border-[#dfe7df] bg-transparent px-3 text-sm text-[#26332a] outline-none transition focus:border-[#07883e] focus:ring-2 focus:ring-[#07883e]/10"
          />

          <FieldError className="mt-1 text-xs text-red-600" />
        </TextField>

        {/* Confirm Password */}
        <TextField isRequired name="confirmPassword" type="password">
          <Label className="mb-1.5 block text-sm font-semibold text-[#354039]">
            পাসওয়ার্ড নিশ্চিত করুন
          </Label>

          <Input
            placeholder="আবার লিখুন"
            autoComplete="new-password"
            className="h-[38px] w-full rounded-lg border border-[#dfe7df] bg-transparent px-3 text-sm text-[#26332a] outline-none transition focus:border-[#07883e] focus:ring-2 focus:ring-[#07883e]/10"
          />

          <FieldError className="mt-1 text-xs text-red-600" />
        </TextField>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Create Account Button */}
        <Button
          type="submit"
          className="mt-0.5 h-[39px] w-full rounded-lg bg-[#07883e] text-sm font-semibold text-white shadow-[0_3px_0_#056c31] transition hover:bg-[#067735] active:translate-y-0.5 active:shadow-none"
        >
          অ্যাকাউন্ট তৈরি করুন
        </Button>
      </Form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#dfe5df]" />

        <span className="text-xs text-[#69736b]">অথবা</span>

        <div className="h-px flex-1 bg-[#dfe5df]" />
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onPress={() =>
            alert("Google Sign Up-এর জন্য Google Authentication যুক্ত করতে হবে।")
          }
          className="flex h-[38px] min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#dfe7df] bg-transparent px-2 text-xs font-semibold text-[#37413a] transition hover:bg-[#f1f5f0] sm:text-[13px]"
        >
          <svg viewBox="0 0 48 48" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.01 13.22l7.98 6.19C12.88 13.72 17.98 9.5 24 9.5Z" transform="translate(0 4)"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.02 46.98 31.93 46.98 24.55Z" transform="translate(0 -1)"/>
            <path fill="#FBBC05" d="M10.99 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 0)"/>
            <path fill="#34A853" d="M24 47c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.88 2.3-8.18 2.3-6.02 0-11.12-4.22-13.01-9.91l-7.98 6.19C6.51 41.62 14.62 47 24 47Z" transform="translate(0 -2)"/>
          </svg>

          <span className="truncate">Google দিয়ে চালিয়ে যান</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onPress={() =>
            alert("GitHub Sign Up-এর জন্য GitHub Authentication যুক্ত করতে হবে।")
          }
          className="flex h-[38px] min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#dfe7df] bg-transparent px-2 text-xs font-semibold text-[#37413a] transition hover:bg-[#f1f5f0] sm:text-[13px]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.31-3.76-1.31-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.76 1.02.76 2.06v3.09c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/>
          </svg>

          <span className="truncate">GitHub দিয়ে চালিয়ে যান</span>
        </Button>
      </div>

      {/* Login Link */}
      <p className="mt-4 text-center text-sm text-[#58625a]">
        অ্যাকাউন্ট আছে?{" "}
        <a
          href="/login"
          className="font-medium text-[#07883e] transition hover:text-[#056c31]"
        >
          সাইন ইন করুন
        </a>
      </p>
    </div>

    {/* Back to Home */}
    <div className="mt-5 text-center">
      <Link
        href="/"
        className="text-sm text-[#858e86] transition hover:text-[#07883e]"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  </div>
</main>


);
}

export default Basic;
