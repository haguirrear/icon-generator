import NavBar from "~/components/NavBar"



export async function loader() {
  return null
}

export function headers() {
  return {
    "Cache-Control": "max-age=3600, s-maxage=3600, public"
  }
}


export default function Index() {
  return <>
    <NavBar></NavBar>
    <div className="container m-auto mb-80 flex flex-col p-8 items-center">
      <div className="max-w-screen-lg flex flex-col items-center">
        <img className="pb-6" src="main-logo.svg" alt="background" />
        <div className="flex gap-8">
          <img src="line.svg" alt="line" />
          <span className="text-primary">Waitlist</span>
          <img className="rotate-180" src="line.svg" alt="line" />
        </div>
        <h1 className="font-satoshi text-9xl font-bold text-center py-8">Create your unique logo</h1>
        <h2 className="font-dmsans text-lg text-center max-w-80 py-4">Fast, simple and easy to user tool suited for your needs.</h2>
      </div>

      <div className="flex min-h-[440px] gap-8 max-w-screen-xl w-full pt-4">
        <div className="flex-1 bg-accent rounded-2xl font-satoshi p-8">
          <h6 className="font-bold  text-xl">Enter the name</h6>
          <p className="text-lg text-muted-foreground">We will use the name to define the industry and the logo generated with AI</p>
        </div>
        <div className="flex-[2] bg-accent rounded-2xl font-satoshi p-8 relative overflow-hidden">
          <h6 className="font-bold  text-xl">Choose the color palette and style</h6>
          <p className="text-lg text-muted-foreground">We will add the style and the magic behind according to what you selected.</p>
          <img className="absolute bottom-0 left-10" src="rainbow-circle.svg" alt="rainbow circle" />
        </div>
        <div className="flex-1 bg-accent rounded-2xl font-satoshi p-8 relative overflow-hidden">
          <h6 className="font-bold  text-xl">All Set!</h6>
          <p className="text-lg text-muted-foreground">You will have a logo tailored to your needs with the option to download in .png or SVG</p>
          <img className="absolute bottom-0 left-0" src="figma.svg" alt="boxes of colors" />
        </div>
      </div>
      <div className="h-52 relative max-w-screen-xl w-full">
        <img className="absolute -top-16" src="planet.png" alt="planet" />
      </div>


      <div className="max-w-screen-md py-8">
        <h2 className="text-7xl font-bold text-center font-satoshi">1. Name</h2>
        <p className="text-xl text-muted-foreground pt-4">Automate design tasks in Figma with a single click</p>
      </div>

      <form action="" className="max-w-screen-sm w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 pointer-events-none flex items-center">
            <img src="sun.svg" alt="sun icon" />
          </div>
          <input className="py-4 pl-12 rounded-3xl w-full bg-accent" type="text" placeholder="Enter your company name" />
          <button className="my-1 mr-1 absolute inset-y-0 right-0 px-6 bg-primary text-primary-foreground rounded-3xl hover:bg-secondary">Continuar</button>
        </div>
      </form>

      <div className="pt-40 text-center w-full max-w-2xl">
        <h2 className="text-5xl font-satoshi font-bold pb-4">Logo Brands</h2>
        <h2 className="text-5xl font-satoshi font-bold bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 bg-clip-text text-transparent">Case studies</h2>
        <div className="py-20 w-full">
          <div className="rounded-full bg-accent flex justify-evenly items-center font-ubuntu w-full">
            <div className="flex gap-1 px-8 py-4 my-2">
              <img src="analysis.svg" alt="graph icon" />
              <span>All</span>
            </div>
            <div className="flex gap-1 px-8 py-4 m-2 rounded-full bg-primary">
              <img src="analysis.svg" alt="graph icon" />
              <span>Marketing</span>
            </div>
            <div className="flex gap-1 px-8 py-4 my-2">
              <img src="analysis.svg" alt="graph icon" />
              <span>Tecnoligy</span>
            </div>
            <div className="flex gap-1 px-8 py-4 my-2">
              <img src="analysis.svg" alt="graph icon" />
              <span>Marketplace</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] w-full flex flex-col items-center">
        <img src="card.png" alt="cards" />
        <div className="relative w-full">
          <img className="rounded-3xl w-full" src="bg.png" alt="purple bg" />
          <div className="absolute inset-y-0 flex flex-col gap-8 justify-center w-full items-center">
            <h3 className="max-w-screen-md text-5xl font-satoshi text-center">Crafting meaningful connections between businesses and people</h3>
            <button className="rounded-full px-8 py-4 bg-primary-foreground text-black">Generate Logo</button>
          </div>
        </div>
      </div>


      <div className="max-w-[1200px] w-full flex flex-col items-stretch py-16">
        <div className="relative">
          <img className="w-full" src="footer.png" alt="planet" />
          <div className="absolute left-0 right-10 top-10 flex justify-end gap-24">
            <a href="/products">Products</a>
            <a href="/services">Services</a>
            <a href="/Pricing">Pricing</a>
            <a href="/Resources">Resources</a>
          </div>
          <div className="absolute bottom-40 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <div className="absolute left-0 right-0 bottom-20 text-center text-sm text-muted-foreground ">&copy;Cpyright <span id="copyyear">2025</span>. Icon Generator. All right reserved.</div>
        </div>
      </div>
    </div>
  </>
}
