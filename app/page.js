import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background to-muted overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center space-y-8 animate-slide-up">
            <div className="inline-block mb-4">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl rotate-6 opacity-30 animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl -rotate-3 opacity-40 animate-pulse-slow delay-300"></div>
                <div className="relative h-full w-full bg-white dark:bg-card flex items-center justify-center rounded-2xl shadow-soft overflow-hidden border border-border/50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 text-primary">
                    <path fill="currentColor" d="M5.5,9A1.5,1.5 0 0,0 7,7.5A1.5,1.5 0 0,0 5.5,6A1.5,1.5 0 0,0 4,7.5A1.5,1.5 0 0,0 5.5,9M17.41,11.58C17.77,11.94 18,12.44 18,13C18,13.55 17.78,14.05 17.41,14.41L12.41,19.41C12.05,19.77 11.55,20 11,20C10.45,20 9.95,19.78 9.58,19.41L2.59,12.42C2.22,12.05 2,11.55 2,11V6C2,4.89 2.89,4 4,4H9C9.55,4 10.05,4.22 10.41,4.58L17.41,11.58M13.54,5.71L14.54,4.71L21.41,11.58C21.78,11.94 22,12.45 22,13C22,13.55 21.78,14.05 21.42,14.41L16.04,19.79L15.04,18.79L20.75,13L13.54,5.71Z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold !leading-tight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Tennis Lesson</span>
              <br />
              <span className="text-foreground">Scheduler</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create perfectly balanced tennis groups that mix up players
              based on their availability with our sleek, intuitive scheduling tool.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link 
                href="/schedules/create"
                className="button-primary group rounded-full py-3 px-8 text-base"
              >
                Create New Schedule
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link 
                href="/schedules"
                className="button-secondary group rounded-full py-3 px-8 text-base"
              >
                View Past Schedules
              </Link>
            </div>
          </div>
          
          {/* Feature cards */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="card p-6 transition-all hover:shadow-md hover:-translate-y-1 duration-300 animate-slide-up [animation-delay:200ms]">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Add Members</h3>
              <p className="text-muted-foreground">Enter member names and their availability or upload an image to extract data automatically.</p>
            </div>
            
            <div className="card p-6 transition-all hover:shadow-md hover:-translate-y-1 duration-300 animate-slide-up [animation-delay:300ms]">
              <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-2xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Select Dates</h3>
              <p className="text-muted-foreground">Choose lesson dates with our interactive calendar that makes date selection effortless.</p>
            </div>
            
            <div className="card p-6 transition-all hover:shadow-md hover:-translate-y-1 duration-300 animate-slide-up [animation-delay:400ms]">
              <div className="w-12 h-12 bg-accent/10 dark:bg-accent/20 rounded-2xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">View Schedules</h3>
              <p className="text-muted-foreground">Browse different scheduling options that intelligently mix up group compositions.</p>
            </div>
          </div>
          
          {/* Screenshot/mockup section */}
          <div className="mt-24 rounded-2xl bg-gradient-to-b from-primary/5 to-secondary/5 border border-border/50 p-6 sm:p-8 shadow-soft animate-slide-up [animation-delay:500ms] overflow-hidden">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Beautifully Simple Experience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our intuitive flow guides you through creating perfectly balanced tennis groups in just a few steps.</p>
            </div>
            
            <div className="flex justify-center relative">
              <div className="relative max-w-full overflow-hidden rounded-lg border border-border/30 shadow-soft">
                {/* Static mockup - in a real app you'd have an actual app screenshot */}
                <div className="bg-card w-full h-[300px] md:h-[400px] overflow-hidden flex items-center justify-center">
                  <div className="p-8 text-center animate-pulse">
                    <p className="text-sm text-muted-foreground">App screenshot will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10 mt-16 py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Tennis Lesson Scheduler. Designed with ♥ for tennis enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
}
