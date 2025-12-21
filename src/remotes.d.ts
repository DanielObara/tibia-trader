declare module 'oracle_advisor/OracleAdvisor' {
    import { FC } from 'react';
    import { Transaction } from './shared/types'; // This path might need adjustment or generic typing
    // Simplified prop type for now to avoid deep coupling issues in declaration
    const OracleAdvisor: FC<{ transactions: any[] }>;
    export default OracleAdvisor;
    export { OracleAdvisor };
}
