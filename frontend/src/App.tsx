import { useTenant } from "./hooks/useTenant";
import Login from "./pages/Login/Login";
import AppRoutes from "./routes/AppRoutes";

function App() {

    const {
        tenantId,
        setTenantId,
    } = useTenant();

    return (

        <div>

            <h1>

                Tenant atual:

                {tenantId}

            </h1>

            <button
                onClick={() =>
                    setTenantId(
                        "123"
                    )
                }
            >

                Salvar Tenant

            </button>
                      return <AppRoutes />;



        </div>



    );

}

export default App;