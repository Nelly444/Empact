function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-pure-white px-24 py-64 text-center sm:py-96">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-radial from-apricot-wash/40 via-transparent to-transparent"
      />
      <h1 className="font-signifier text-heading leading-heading tracking-heading text-ink sm:text-heading-lg sm:leading-heading-lg sm:tracking-heading-lg">
        Describe your cause. We'll find the charity.
      </h1>
      <p className="mx-auto mt-24 max-w-2xl font-sohne text-body-lg leading-body-lg tracking-body-lg text-ash">
        Empact turns a plain-English description of what you care about into real, vetted
        GlobalGiving projects — each with an AI summary and a clear look at how far your donation
        would go.
      </p>
    </section>
  )
}

export default Hero
