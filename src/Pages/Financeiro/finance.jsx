import Sidebar from "../../components/SideBar/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './finance.css';

function Financeiro(){
    return (
        <div className="finance-page">
            <Sidebar activePage="Financeiro" />
        </div>
    );

}

export default Financeiro;