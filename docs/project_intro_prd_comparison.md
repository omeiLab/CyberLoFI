# 🎧 LoFi Chill Station (Music Box Edition) — 專案介紹與 PRD 對比分析

## 📌 1. 專案簡介 (Project Introduction)

**LoFi Chill Station** 是一個基於網頁 Web Audio API 技術打造的輕量化、互動式 LoFi 氛圍音樂站。專為現代人在學習、工作、閱讀或睡眠時提供沉浸式聲音體驗。

在最新版本中，我們將核心鍵盤音色優化為具有空靈感的 **星光音樂盒（Music Box Dream）**，結合演算法生成的白噪音（雨聲、風聲、海浪、篝火）與立體聲空間殘響，讓使用者既能自由彈奏，也能一鍵開啟預設的 LoFi 循環情境，享受極致放鬆的音域體驗。

---

## 🌟 2. 核心功能與亮點 (Core Features)

1. **純 Web Audio API 合成技術**：
   - 無須載入任何龐大的 MP3/WAV 音訊檔，完全透過瀏覽器即時合成聲音。
   - 結合正弦波、泛音疊加與 3.5 秒 Convolver 立體聲殘響，打造晶瑩剔透的音樂盒顆粒感。
2. **多軌環境白噪音 (Ambient Sound Generator)**：
   - 內建演算法生成白噪音（如 lowpass 濾鏡雨聲、風聲、海浪等），支援獨立開關與動態音量滑桿調配。
3. **動態 LoFi 情境旋律 (Preset Scenarios)**：
   - 提供多款預設情境（如 Cozy Corner, Midnight Cabin 等），自動帶入相對應的環境白噪音組合與輕柔循環旋律。
4. **Canvas 動態聲波視覺化 (Visualizer)**：
   - 聲波線條會隨白噪音能量與音符敲擊力道產生波浪振動與能量回饋。
5. **本地偏好儲存 (LocalStorage)**：
   - 自動記憶使用者上次調配的白噪音開關與音量設定。

---

## 📊 3. 與原始 PRD 之對比分析 (PRD Comparison)

| 功能模組 | 原始 PRD 規劃 (Original PRD) | 實際完成版本 (Actual Implementation) | 達成度與差異說明 |
| :--- | :--- | :--- | :--- |
| **主音色 (Main Instrument)** | LoFi 採樣鋼琴 (LoFi Sampled Piano) | Web Audio 音樂盒音色 (Music Box Synth) | **更換與升級**：改用動態波形合成，消除了音訊檔載入延遲，音色更具空靈夢幻感。 |
| **環境白噪音 (Ambient Sounds)** | 多軌獨立音量控制（雨聲、篝火、海浪等） | 全數實作，支援開關與獨立 Volume Slider | **100% 達成**：透過演算法生成，載入速度極快。 |
| **情境切換 (Preset Scenarios)** | 一鍵載入白噪音組合與 Preset 旋律 | 實作多個情境，並加入 UI 按鈕 Active 高亮顯示 | **100% 達成**：提升視覺反饋與情境切換體驗。 |
| **互動琴鍵 (Interactive Pads)** | 支援 Mouse / Touch / 電腦鍵盤觸發 | 完全支援（滑鼠點擊、觸控按壓、鍵盤按鍵映射） | **100% 達成**：動態 Keydown/Keyup 樣式回饋流暢。 |
| **聲音視覺化 (Visualizer)** | 響應式 Canvas 音高/能量動畫 | Canvas 繪製動態三軌波紋，並隨音符能量衝擊 | **100% 達成**：音符發聲時瞬間提升能量振幅。 |
| **偏好記憶 (User Storage)** | 記憶開關狀態與音量 | 使用 `localStorage` 讀寫使用者設定 | **100% 達成**。 |

---

## 🚀 4. 未來擴充方向 (Future Roadmap)

1. **更多音色切換**：未來可加入 Toggle，讓使用者在「LoFi 復古鋼琴」與「星光音樂盒」之間自由切換。
2. **BPM / 節拍控制**：提供輕量級節奏 Metronome 或 LoFi Drum Loop 輔助。
3. **客製化旋律錄製**：允許使用者錄製自己彈奏的音樂盒旋律並匯出。