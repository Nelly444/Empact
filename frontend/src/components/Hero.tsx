function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink px-24 py-64 text-center sm:py-96">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="animate-blob-a will-change-transform absolute -left-[140px] -top-[140px] h-[380px] w-[380px] rounded-full bg-rust opacity-60 blur-[90px] motion-reduce:animate-none"
        />
        <div
          className="animate-blob-b will-change-transform absolute -bottom-[160px] -right-[140px] h-[380px] w-[380px] rounded-full bg-teal opacity-60 blur-[90px] motion-reduce:animate-none"
          style={{ animationDelay: '-4s' }}
        />
        <div
          className="animate-blob-c will-change-transform absolute -right-[60px] top-[-40px] h-[240px] w-[240px] rounded-full bg-apricot-wash opacity-40 blur-[70px] motion-reduce:animate-none"
          style={{ animationDelay: '-2.5s' }}
        />
        <div
          className="animate-blob-d will-change-transform absolute -bottom-[60px] -left-[60px] h-[240px] w-[240px] rounded-full bg-sky-wash opacity-30 blur-[70px] motion-reduce:animate-none"
          style={{ animationDelay: '-7s' }}
        />
      </div>
      <h1 className="font-signifier text-heading leading-heading tracking-heading text-pure-white sm:text-heading-lg sm:leading-heading-lg sm:tracking-heading-lg">
        Describe your cause. We'll find the charity.
      </h1>
      <p className="mx-auto mt-24 max-w-2xl font-sohne text-body-lg leading-body-lg tracking-body-lg text-pure-white/80">
        Empact turns a plain-English description of what you care about into real, vetted
        GlobalGiving projects — each with an AI summary and a clear look at how far your donation
        would go.
      </p>
    </section>
  )
}

export default Hero
