import XLSX from "xlsx";

const wb = XLSX.utils.book_new();

// ─── Config ───────────────────────────────────────────────
const configHeaders = [
  ["Đội nhà", "Đội khách"],
  ["actual_home_goals", "actual_away_goals"],
];
const configMeta = XLSX.utils.aoa_to_sheet(configHeaders);
XLSX.utils.sheet_add_aoa(configMeta, [["", "", "", "", "", ""]], { origin: "A2" });
XLSX.utils.sheet_add_aoa(configMeta, [["Câu hỏi", "Đáp án đúng", "Điểm nếu đúng"]], {
  origin: "A4",
});

const defaultQuestions = [
  ["Có bàn thắng trong hiệp 1?", "", 3],
  ["Tổng bàn thắng trên 2.5?", "", 3],
  ["Có thẻ đỏ trong trận?", "", 3],
  ["Đội nào giao bóng trước?", "", 2],
  ["Cầu thủ xuất sắc nhất trận?", "", 5],
];

XLSX.utils.sheet_add_aoa(configMeta, defaultQuestions, { origin: "A5" });

configMeta["!cols"] = [{ wch: 40 }, { wch: 30 }, { wch: 16 }];
XLSX.utils.book_append_sheet(wb, configMeta, "Cấu hình");

// ─── Players ──────────────────────────────────────────────
const playersData = [
  ["Tên cầu thủ", "Đội"],
  ["", "Nhà"],
  ["", "Khách"],
];
const playersSheet = XLSX.utils.aoa_to_sheet(playersData);
playersSheet["!cols"] = [{ wch: 24 }, { wch: 10 }];
XLSX.utils.book_append_sheet(wb, playersSheet, "Cầu thủ");

// ─── Predictions ──────────────────────────────────────────
const predHeaders = [
  [
    "#",
    "Discord Username",
    "Nhà",
    "Khách",
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "Q5 (MOTM)",
    "Điểm KQ",
    "Điểm Nhà",
    "Điểm Khách",
    "Điểm GD",
    "Điểm Q1",
    "Điểm Q2",
    "Điểm Q3",
    "Điểm Q4",
    "Điểm Q5",
    "Tổng",
  ],
];

const predSheet = XLSX.utils.aoa_to_sheet(predHeaders);
predSheet["!cols"] = [
  { wch: 4 },
  { wch: 22 },
  { wch: 6 },
  { wch: 6 },
  { wch: 14 },
  { wch: 14 },
  { wch: 14 },
  { wch: 14 },
  { wch: 18 },
  { wch: 10 },
  { wch: 10 },
  { wch: 10 },
  { wch: 10 },
  { wch: 10 },
  { wch: 10 },
  { wch: 10 },
  { wch: 10 },
  { wch: 10 },
  { wch: 8 },
];

// Sample rows so user can see format
const sampleRows = [
  [
    1,
    "user1",
    2,
    1,
    "Có",
    "Trên 2.5",
    "Không",
    "Đội nhà",
    "Mbappe",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    2,
    "user2",
    1,
    1,
    "Không",
    "Dưới 2.5",
    "Có",
    "Đội khách",
    "Haaland",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
];

XLSX.utils.sheet_add_aoa(predSheet, sampleRows, { origin: "A2" });

// Add formulas for rows 2 and 3
// J = Điểm KQ = 3 if result matches
for (let r = 2; r <= 3; r++) {
  const ref = r;
  // J = col 10: KQ points
  predSheet[XLSX.utils.encode_cell({ r: r - 1, c: 9 })] = {
    f: `IF(SIGN(C${ref}-D${ref})=SIGN('Cấu hình'!B2-'Cấu hình'!E2),3,0)`,
  };
  // K = col 11: Exact home goals
  predSheet[XLSX.utils.encode_cell({ r: r - 1, c: 10 })] = {
    f: `IF(C${ref}='Cấu hình'!B2,1,0)`,
  };
  // L = col 12: Exact away goals
  predSheet[XLSX.utils.encode_cell({ r: r - 1, c: 11 })] = {
    f: `IF(D${ref}='Cấu hình'!E2,1,0)`,
  };
  // M = col 13: GD exact
  predSheet[XLSX.utils.encode_cell({ r: r - 1, c: 12 })] = {
    f: `IF(C${ref}-D${ref}='Cấu hình'!B2-'Cấu hình'!E2,1,0)`,
  };
  // N-R = col 14-18: Bonus Q1-Q5
  for (let q = 0; q < 5; q++) {
    const col = 13 + q;
    const answerCol = String.fromCharCode(69 + q); // E, F, G, H, I
    const configRow = 5 + q;
    predSheet[XLSX.utils.encode_cell({ r: r - 1, c: col })] = {
      f: `IF(${answerCol}${ref}="",0,IF(${answerCol}${ref}='Cấu hình'!B${configRow},'Cấu hình'!C${configRow},0))`,
    };
  }
  // S = col 19: Total
  predSheet[XLSX.utils.encode_cell({ r: r - 1, c: 18 })] = {
    f: `SUM(J${ref}:R${ref})`,
  };
}

XLSX.utils.book_append_sheet(wb, predSheet, "Dự đoán");

// ─── Write ────────────────────────────────────────────────
const outPath = "UCL_Predictor.xlsx";
XLSX.writeFile(wb, outPath);
console.log(`✅ Created ${outPath}`);
