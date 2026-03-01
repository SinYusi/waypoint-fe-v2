// "use client";

// import { useState } from "react";
// import BudgetSummaryCard from "@/components/card/BudgetSummaryCard";
// import BudgetEditDialog from "@/components/common/BudgetEditDialog";

// type BudgetMode = "budget" | "expense";

// interface DialogConfig {
//   defaultMode: BudgetMode;
//   /** undefined = placeholder 표시 */
//   initialBudget?: number;
//   initialPersonCount?: number;
// }

// export default function BudgetSummaryCardPreviewPage() {
//   /** 저장된 variant (null = 예산 미설정) */
//   const [variant, setVariant] = useState<BudgetMode | null>("budget");
//   const [totalBudget, setTotalBudget] = useState<number | undefined>(1_500_000);
//   const [personCount, setPersonCount] = useState<number | undefined>(4);

//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [dialogConfig, setDialogConfig] = useState<DialogConfig>({ defaultMode: "budget" });

//   const openDialog = (config: DialogConfig) => {
//     setDialogConfig(config);
//     setIsEditOpen(true);
//   };

//   const handleSave = ({
//     mode,
//     totalBudget: nextBudget,
//     personCount: nextPersonCount,
//   }: {
//     mode: BudgetMode;
//     totalBudget?: number;
//     personCount?: number;
//   }) => {
//     setVariant(mode);
//     setTotalBudget(nextBudget);
//     setPersonCount(nextPersonCount);
//   };

//   const perPerson =
//     totalBudget && personCount ? Math.floor(totalBudget / personCount) : 0;

//   return (
//     <div className="min-h-screen bg-background py-10 flex flex-col gap-10">
//       <h1 className="px-5 typography-body-sm-bold text-muted-foreground">
//         BudgetSummaryCard + BudgetEditDialog Preview
//       </h1>

//       {/* view 모드 */}
//       <section className="flex flex-col gap-2">
//         <p className="px-5 typography-body-sm-reg text-muted-foreground">view 모드</p>
//         <BudgetSummaryCard
//           variant={variant ?? undefined}
//           mode="view"
//           totalBudget={totalBudget}
//           usedAmount={564000}
//           perDayAmount={188000}
//           perPersonAmount={perPerson}
//           showHint
//         />
//       </section>

//       {/* 예산 미설정 — placeholder 표시 확인 */}
//       <section className="flex flex-col gap-2">
//         <p className="px-5 typography-body-sm-reg text-muted-foreground">
//           예산 미설정 edit 모드 → 예산 중심 탭, 초기값 없음 (placeholder)
//         </p>
//         <BudgetSummaryCard
//           mode="edit"
//           onEditClick={() =>
//             openDialog({ defaultMode: "budget" })
//           }
//         />
//       </section>

//       {/* 예산 중심 — 저장된 값 표시 확인 */}
//       <section className="flex flex-col gap-2">
//         <p className="px-5 typography-body-sm-reg text-muted-foreground">
//           예산 중심 edit 모드 → 예산 중심 탭, 저장된 값 표시
//         </p>
//         <BudgetSummaryCard
//           variant="budget"
//           mode="edit"
//           totalBudget={totalBudget}
//           usedAmount={564000}
//           perDayAmount={188000}
//           perPersonAmount={perPerson}
//           onEditClick={() =>
//             openDialog({
//               defaultMode: "budget",
//               initialBudget: totalBudget,
//               initialPersonCount: personCount,
//             })
//           }
//         />
//       </section>

//       {/* 지출 중심 — 인원 수만 표시 확인 */}
//       <section className="flex flex-col gap-2">
//         <p className="px-5 typography-body-sm-reg text-muted-foreground">
//           지출 중심 edit 모드 → 지출 중심 탭, 인원 수만 표시
//         </p>
//         <BudgetSummaryCard
//           variant="expense"
//           mode="edit"
//           usedAmount={564000}
//           perDayAmount={188000}
//           perPersonAmount={perPerson}
//           onEditClick={() =>
//             openDialog({
//               defaultMode: "expense",
//               initialPersonCount: personCount,
//             })
//           }
//         />
//       </section>

//       {/* 다이얼로그 — key로 config 변경 시 상태 초기화 */}
//       <BudgetEditDialog
//         key={`${dialogConfig.defaultMode}-${isEditOpen}`}
//         open={isEditOpen}
//         onOpenChange={setIsEditOpen}
//         defaultMode={dialogConfig.defaultMode}
//         initialBudget={dialogConfig.initialBudget}
//         initialPersonCount={dialogConfig.initialPersonCount}
//         onSave={handleSave}
//       />
//     </div>
//   );
// }
