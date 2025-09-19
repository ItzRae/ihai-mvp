import Navbar from "./Navbar.jsx";
import UsersTable from "./UsersTable.jsx";

const UserHome = () => {
    // const isAuthed = !!localStorage.getItem("access_token");

    return (
        <>
        <Navbar />
        <section className="mt-30"> 
            <h1>TEMP USER HOME</h1>       
            <UsersTable/>
        </section>

        </>
    )


}

export default UserHome;