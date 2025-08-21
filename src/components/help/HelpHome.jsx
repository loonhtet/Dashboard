const HelpHome = () => {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Help & Support Guide</h1>

      <div className="h-[85vh] overflow-hidden rounded-lg border shadow-sm">
        <iframe
          src="/helpguide/help.pdf"
          className="h-full w-full"
          title="Help & Support Guide"
        />
      </div>
    </section>
  );
};

export default HelpHome;
