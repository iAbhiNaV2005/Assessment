import { BorrowerProfile } from './types';

export interface PersonaMetadata {
  id: 'priya' | 'ravi' | 'anita';
  name: string;
  age: number;
  location: string;
  profession: string;
  loanAskFormatted: string;
  coreDilemma: string;
  profile: BorrowerProfile;
}

export const PERSONA_PRESETS: Record<'priya' | 'ravi' | 'anita', PersonaMetadata> = {
  priya: {
    id: 'priya',
    name: 'Priya',
    age: 29,
    location: 'Bengaluru',
    profession: 'MNC Software Engineer · Salaried',
    loanAskFormatted: '₹8,00,000 for wedding',
    coreDilemma: 'Bank offers to sanction ₹21 Lakhs, but wedding is pure consumption. What is safe to carry and what rate should she demand with a 780 CIBIL?',
    profile: {
      name: 'Priya',
      age: 29,
      city: 'Bengaluru',
      employmentType: 'salaried',
      monthlyIncome: 110000,
      existingEmis: 14000, // car loan
      householdExpenses: 25000,
      rent: 28000,
      loanAmountWanted: 800000,
      loanPurpose: 'wedding',
      creditScoreKnown: true,
      creditScore: 780,
      emergencySavingsMonths: 4,
      isProductiveAsset: false,
      existingLoanCount: 1,
      pastYearBounces: 0,
      highCostAppDebtOutstanding: 0,
    }
  },
  ravi: {
    id: 'ravi',
    name: 'Ravi',
    age: 42,
    location: 'Mysuru',
    profession: 'Kirana Store Owner · Self-employed',
    loanAskFormatted: '₹15,00,000 for stock & delivery vehicle',
    coreDilemma: 'Low ITR (₹4.2L) means banks reject unsecured ₹15L or quote 22%+, despite ₹45L unencumbered shop property and 14-year vintage.',
    profile: {
      name: 'Ravi',
      age: 42,
      city: 'Mysuru',
      employmentType: 'self_employed',
      monthlyIncome: 60000, // cash income 40k - 80k
      incomeMin: 40000,
      incomeMax: 80000,
      itrAnnualIncome: 420000, // ITR 4.2L / yr
      coApplicantIncome: 18000, // wife teaching
      unencumberedPropertyVal: 4500000, // owned shop premises ₹45L
      existingEmis: 0,
      householdExpenses: 22000,
      rent: 0, // owns premises
      loanAmountWanted: 1500000,
      loanPurpose: 'business_expansion',
      creditScoreKnown: false, // never taken formal loan
      creditScore: undefined,
      emergencySavingsMonths: 2,
      isProductiveAsset: true,
      existingLoanCount: 0,
      pastYearBounces: 0,
      highCostAppDebtOutstanding: 0,
    }
  },
  anita: {
    id: 'anita',
    name: 'Anita',
    age: 35,
    location: 'Hubballi',
    profession: 'Delivery Rider & Tailor · Informal',
    loanAskFormatted: '₹1,50,000 for electric scooter',
    coreDilemma: 'Productive EV scooter could double earnings, but 3 predatory app loans at 30%+ with a recent bounce create extreme debt trap risk.',
    profile: {
      name: 'Anita',
      age: 35,
      city: 'Hubballi',
      employmentType: 'informal',
      monthlyIncome: 28000, // 26k - 30k
      incomeMin: 26000,
      incomeMax: 30000,
      existingEmis: 4800, // servicing app debt
      householdExpenses: 18000, // 2 children + unemployed husband
      rent: 4000,
      loanAmountWanted: 150000,
      loanPurpose: 'vehicle_asset',
      creditScoreKnown: false,
      creditScore: undefined,
      emergencySavingsMonths: 0.5,
      isProductiveAsset: true,
      expectedMonthlyEarningsBoost: 12000,
      existingLoanCount: 3,
      pastYearBounces: 1, // 1 bounce last month
      highCostAppDebtOutstanding: 35000, // 35k at 30%+
    }
  }
};
