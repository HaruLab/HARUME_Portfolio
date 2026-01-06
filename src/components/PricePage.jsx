import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SelectField from "@/components/SelectField";
import PriceSummary from "@/components/PriceSummary";
import DetailsInfo from "@/components/DetailsInfo";
import { Providers } from "@/components/Providers";
import { motion } from "framer-motion";

const PRICE_CONFIG = {
  mv: 10000,
  pv: 15000,
  background: 5000,
  production: {
    standard: 0,
    advanced: 15000, // 高度なモーション
    premium: 30000,  // モーション + CG
  },
  deadline: {
    1: 5000, // 1か月以内
    2: 2000, // 2か月以上
    0: 0, // 指定なし
  },
};

const DEADLINE_TEXT = {
  1: "1か月",
  2: "2か月",
  0: "指定なし",
};

const LEVEL_DESCRIPTIONS = {
  standard: "歌詞入れなど基本的な編集を中心とした構成です。3DCGやモーショングラフィックスなどは基本的には使用しません。",
  advanced: "一部シーンにモーショングラフィックスや3DCGを使うことがあります。",
  premium: "3DCGやモーショングラフィックスなどを多く用いた構成が可能です。制作に時間がかかります。",
};

export default function Price() {
  const [productionLevel, setProductionLevel] = useState("standard");
  const [deadline, setDeadline] = useState("0");

  const [totalPrice, setTotalPrice] = useState(15000);
  const basePrice = 15000;
  const [deadlineExtra, setDeadlineExtra] = useState(0);
  const [productionExtra, setProductionExtra] = useState(0);
  const [deliveryText, setDeliveryText] = useState("指定なし");

  // 料金計算ロジック
  useEffect(() => {
    const calculateEstimatedPrice = () => {
      const newDeadlineExtra = PRICE_CONFIG.deadline[deadline] || 0;
      const newProductionExtra = PRICE_CONFIG.production[productionLevel] || 0;

      setDeadlineExtra(newDeadlineExtra);
      setProductionExtra(newProductionExtra);
      setTotalPrice(basePrice + newDeadlineExtra + newProductionExtra);
      setDeliveryText(DEADLINE_TEXT[deadline] || "指定なし");
    };

    calculateEstimatedPrice();
  }, [productionLevel, deadline]);

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header breadcrumbReplacements={{ price: "PRICE" }} />

      <main className="flex-1 w-full max-w-[1920px] px-6 md:px-12 lg:px-24 pb-10 pt-24 md:pt-44 lg:pt-52 text-left">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="space-y-2">

            {/* Main Calculator Card */}
            <div className="bg-[var(--bg-secondary)]/80 rounded-[2.5rem] overflow-hidden border border-[var(--border-color)]/20 w-full">
              <div className="p-8 md:p-12 lg:p-16 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] font-display">
                    料金計算機
                  </h2>
                  <motion.p 
                    key={productionLevel}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 0.6, x: 0 }}
                    className="text-sm md:text-base leading-relaxed break-words max-w-2xl"
                  >
                    {LEVEL_DESCRIPTIONS[productionLevel]}
                  </motion.p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                  <div className="space-y-8">
                    <SelectField
                      id="productionLevel"
                      label="クオリティ"
                      type="native"
                      options={[
                        { value: "standard", label: "梅 (Standard)" },
                        { value: "advanced", label: "竹 (Advanced)" },
                        { value: "premium", label: "松 (Premium)" },
                      ]}
                      value={productionLevel}
                      onChange={(e) => setProductionLevel(e.target.value)}
                    />

                    <SelectField
                      id="deadline"
                      label="納期"
                      type="native"
                      options={[
                        { value: "1", label: "1か月以内" },
                        { value: "2", label: "2か月以上" },
                        { value: "0", label: "それ以上" },
                      ]}
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                  
                  {/* Integrated Summary Box aligned right */}
                  <div className="h-full flex flex-col justify-end">
                     <PriceSummary
                       totalPrice={totalPrice}
                       productionLevel={productionLevel}
                     />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 w-full">
              
              <DetailsInfo summary="注意事項">
                <ul className="space-y-4 text-sm md:text-base leading-relaxed text-[var(--text-primary)] p-6 font-medium">
                  <li className="flex gap-3">
                    <span className="opacity-40">✦</span>
                    <span>2026年1月より料金を改定しました。</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="opacity-40">✦</span>
                    <span>本業ではないため短い納期の場合受付できません。</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="opacity-40">✦</span>
                    <span>この計算機は大体の目安を示すもので正確な金額ではありません。</span>
                  </li>
                </ul>
              </DetailsInfo>

              <DetailsInfo summary="規約・お支払い">
                <ul className="space-y-4 text-sm md:text-base leading-relaxed text-[var(--text-primary)] p-6 font-medium">
                  <li className="flex gap-3">
                    <span className="opacity-40">✦</span>
                    <span>支払いはPayPal, Kyash, Amazonギフトでお支払いお願いします。誠に申し訳ありませんが、銀行振込は対応しておりません。</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="opacity-40">✦</span>
                    <span>完成品は実績として公開させていただく場合があります。非公開希望の場合はご連絡ください。</span>
                  </li>
                </ul>
              </DetailsInfo>

              <DetailsInfo summary="ご依頼時に伝えてほしいこと">
                <div className="p-6 space-y-2">
                  <div className="flex flex-col gap-2">
                    {["希望納期", "ご予算", "活動名", "ご連絡先", "参考資料 (URLなど)"].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 py-2 border-b border-[var(--border-color)]/10 last:border-0">
                        <span className="text-xs font-bold font-display opacity-40 w-6">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm md:text-base font-bold text-[var(--text-primary)]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </DetailsInfo>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
      </div>
    </Providers>
  );
}
