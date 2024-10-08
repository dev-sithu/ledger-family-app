import {FC} from "react";
import {Box, Container} from "@mui/material";
import Navbar from "../../components/Navbar/Navbar.tsx";
import Header from "../../components/Header/Header.tsx";
import InfoCard from "../../components/Card/InfoCard.tsx";
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import WalletIcon from '@mui/icons-material/Wallet';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalculateIcon from '@mui/icons-material/Calculate';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BalanceIcon from '@mui/icons-material/Balance';
import MonthNavigator from "../../components/MonthNavigator.tsx";
import {useUserLedger} from "../../queries/queries.hook.ts";
import {getLoginUser} from "../../lib/utils.ts";
import Loading from "../../components/Loading/Loading.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../state/store.ts";

const Dashboard: FC = () => {
  const { activeMonth } = useSelector((state: RootState) => state.monthNav);
  const user = getLoginUser();
  const {data: ledger, isPending, isSuccess} = useUserLedger(user.id, activeMonth);

  return (
    <Box className="app">
      <Header title="Dashboard" />
      <Container maxWidth="lg">
        <MonthNavigator />
        { isPending && <Loading/>}
        { isSuccess &&
          <>
            <InfoCard title="Current" amount={ledger ? ledger.current : 0} icon={<AccountBalanceIcon/>} />
            <InfoCard title="Income" amount={ledger ? ledger.income : 0} icon={<BusinessCenterIcon/>} />
            <InfoCard title="Parent Support" amount={ledger ? ledger.parentSupport : 0} icon={<FamilyRestroomIcon/>} />
            <InfoCard title="Budget" amount={ledger ? ledger.budget : 0} icon={<CalculateIcon/>} />
            <InfoCard title="Gross Saving" amount={ledger ? ledger.grossSaving : 0} icon={<SavingsIcon/>} />
            <InfoCard title="Expense (Cash)" amount={ledger ? ledger.expenseCash : 0} icon={<LocalAtmIcon/>} />
            <InfoCard title="Expense (Bank)" amount={ledger ? ledger.expenseBank : 0} icon={<PaymentIcon/>} />
            <InfoCard title="Total Cost" amount={ledger ? ledger.cost : 0} icon={<MonetizationOnIcon/>} />
            <InfoCard title="Budget Balance" amount={ledger ? ledger.budget - ledger.expenseCash : 0} icon={<BalanceIcon/>} />
            <InfoCard title="Net Saving" amount={ledger ? ledger.netSaving : 0} icon={<WalletIcon/>} />
            <InfoCard title="Balance" amount={ledger ? ledger.balance : 0} icon={<AccountBalanceWalletIcon/>} />
          </>
        }
      </Container>
      <Navbar/>
    </Box>
  );
}

export default Dashboard;
