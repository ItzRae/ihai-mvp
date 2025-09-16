import Navbar from "./Navbar.jsx";

const Home = () => {

    return (
        <>
        <Navbar />
        <section className="bg-no-repeat bg-cover bg-bottom w-full h-screen"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%),
        url('/main-hero.jpg')`}}>

        </section>
        </>
    )


}

export default Home;