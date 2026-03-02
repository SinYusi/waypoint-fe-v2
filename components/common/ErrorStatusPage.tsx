import Header from "@/components/layout/Header";

interface ErrorStatusPageProps {
  title: string;
  description: string;
  illustration: React.ReactNode;
}

const ErrorStatusPage = ({
  title,
  description,
  illustration,
}: ErrorStatusPageProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        showBackButton
        leftBtnBgVariant="ghost"
        className="fixed inset-x-0 top-0 z-10"
      />

      <main className="mt-15 flex flex-1 justify-center px-5 pt-7 pb-3.5">
        <section className="flex h-172.5 w-full max-w-83.75 flex-col items-center justify-center gap-3 p-0 text-center">
          <div className="h-[100.003px] w-[219.617px] [&>svg]:h-full [&>svg]:w-full">
            {illustration}
          </div>

          <div className="flex h-19 w-67.75 items-center justify-center">
            <div className="flex h-19 w-45.25 flex-col gap-3">
              <h1 className="typography-label-base-sb text-[#1C2024]">
                {title}
              </h1>
              <p className="typography-body-sm-reg whitespace-pre-line text-center text-[#757575]">
                {description}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ErrorStatusPage;
