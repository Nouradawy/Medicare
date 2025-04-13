import NavBar from './components/NavBar/NavBar.jsx'

function App() {

  return (
      <div className="w-full min-h-screen  bg-[#4B34DD] ">
          <NavBar />
            <div className="pt-2 pl-6
            md:pl-[8%] md:pt-32
            text-[#C0D2FF] relative z-10">
          <div className="text-3xl md:text-5xl font-medium tracking-tight">Feel better about</div>
          <div className="text-3xl md:text-5xl font-medium tracking-tight">finding healthcare</div>
            <div className="text-[0.8rem] pt-5 text-[#A7EFFF] font-light
            md:text-2xl md:pt-20 ">At Healthgrades , we take the guesswork out of finding </div>
            <div className="text-[0.8rem] font-light text-[#A7EFFF]
             md:text-2xl">the right doctors , clinic and care for your family. </div>
                <div className="flex space-x-48 pt-20">
                    <div className="w-[260px] h-[60px] bg-[#2C2C2C] rounded-xl flex">
                            <svg width="47" height="43" viewBox="0 0 47 43" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '17px' , marginLeft: '20px'}}>
                                <path d="M0 38H47V43H0V38Z" fill="#FFCCFA"/>
                                <path d="M29 26.25V23.75C29 22.4239 28.4732 21.1521 27.5355 20.2145C26.5979 19.2768 25.3261 18.75 24 18.75H15.25C13.9239 18.75 12.6521 19.2768 11.7145 20.2145C10.7768 21.1521 10.25 22.4239 10.25 23.75V26.25M31.5 10L37.75 16.25M37.75 10L31.5 16.25M24.625 8.75C24.625 11.5114 22.3864 13.75 19.625 13.75C16.8636 13.75 14.625 11.5114 14.625 8.75C14.625 5.98858 16.8636 3.75 19.625 3.75C22.3864 3.75 24.625 5.98858 24.625 8.75Z" stroke="#95D2FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        <div className="pl-6 pt-1">
                            <p className="italic font-light text-[#F5F5F5] leading-none font-[Inter] text-[1rem] pt-2 ">Profiles for Every</p>
                            <p className="italic font-light text-[#F5F5F5]  font-[Inter] text-[1rem] ">Doctor in Egypt</p>
                        </div>

                        </div>


                    <div className="w-[260px] h-[60px] bg-[#2C2C2C] rounded-xl flex">
                        <svg width="47" height="43" viewBox="0 0 47 43" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '17px' , marginLeft: '20px'}}>
                            <path d="M0 38H47V43H0V38Z" fill="#FFCCFA"/>
                            <path d="M29 26.25V23.75C29 22.4239 28.4732 21.1521 27.5355 20.2145C26.5979 19.2768 25.3261 18.75 24 18.75H15.25C13.9239 18.75 12.6521 19.2768 11.7145 20.2145C10.7768 21.1521 10.25 22.4239 10.25 23.75V26.25M31.5 10L37.75 16.25M37.75 10L31.5 16.25M24.625 8.75C24.625 11.5114 22.3864 13.75 19.625 13.75C16.8636 13.75 14.625 11.5114 14.625 8.75C14.625 5.98858 16.8636 3.75 19.625 3.75C22.3864 3.75 24.625 5.98858 24.625 8.75Z" stroke="#95D2FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div className="pl-6 pt-1">
                            <p className="italic font-light text-[#F5F5F5] leading-none font-[Inter] text-[1rem] pt-2 ">Profiles for Every</p>
                            <p className="italic font-light text-[#F5F5F5]  font-[Inter] text-[1rem] ">Doctor in Egypt</p>
                        </div>

                    </div>
                </div>
                </div>
          <img src="/images/Main%20doc.png" alt="Hero" className="absolute top-[40] right-4
          md:top-25 md:right-[5%] w-1/2 md:w-3xl
          object-contain z-0" />

      </div>

  )
}

export default App
