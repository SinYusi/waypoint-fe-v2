// "use client";

// import { useState } from "react";
// import BudgetBottomSheet, {
//   type BudgetBottomSheetMode,
//   type EditExpenseItem,
// } from "@/components/common/BudgetBottomSheet";

// type CaseConfig = {
//   label: string;
//   mode: BudgetBottomSheetMode;
//   placeName?: string;
//   editItems?: EditExpenseItem[];
// };

// const CASES: CaseConfig[] = [
//   {
//     label: "지출 추가 (지출없음 카드 클릭)",
//     mode: "add-expense",
//     placeName: "롯데월드",
//   },
//   {
//     label: "지출 수정/삭제 (기존 지출 카드 클릭) — 단일 항목",
//     mode: "edit-expense",
//     placeName: "에버랜드",
//     editItems: [{ name: "입장권", cost: 65000 }],
//   },
//   {
//     label: "지출 수정/삭제 — 복수 항목",
//     mode: "edit-expense",
//     placeName: "제주도 카페",
//     editItems: [
//       { name: "아메리카노", cost: 5500 },
//       { name: "케이크", cost: 8000 },
//     ],
//   },
//   {
//     label: "추가 지출 생성",
//     mode: "create-expense",
//   },
// ];

// export default function BudgetBottomSheetPreviewPage() {
//   const [open, setOpen] = useState(false);
//   const [current, setCurrent] = useState<CaseConfig>(CASES[0]);

//   const openWith = (c: CaseConfig) => {
//     setCurrent(c);
//     setOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-background py-10 flex flex-col gap-6 px-5">
//       <h1 className="typography-body-sm-bold text-muted-foreground">
//         BudgetBottomSheet Preview
//       </h1>

//       {CASES.map((c, i) => (
//         <section key={i} className="flex flex-col gap-2">
//           <p className="typography-body-sm-reg text-muted-foreground">{c.label}</p>
//           <button
//             type="button"
//             onClick={() => openWith(c)}
//             className="h-11 w-full rounded-2xl border border-border typography-label-base-sb text-foreground"
//           >
//             열기
//           </button>
//         </section>
//       ))}

//       <BudgetBottomSheet
//         open={open}
//         onOpenChange={setOpen}
//         mode={current.mode}
//         placeName={current.placeName}
//         editItems={current.editItems}
//       />
//     </div>
//   );
// }
