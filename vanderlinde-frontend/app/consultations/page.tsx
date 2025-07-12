import Consultations from "@/components/consultation/consultations"
import Sidebar from "@/components/ui/sidebar"

const ConsultationsPage = () => {
    return (
        <main className="flex">
            <Sidebar />
            <Consultations />
        </main>
    )
}

export default ConsultationsPage
