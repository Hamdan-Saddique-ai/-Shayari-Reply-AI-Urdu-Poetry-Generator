// Shayari Reply AI - Frontend Logic
// This version uses a local shayari database for demo
// For production, connect to backend API

class ShayariAI {
    constructor() {
        this.shayariDatabase = this.initShayariDatabase();
        this.currentShayari = null;
        this.currentRoman = null;
        this.initEventListeners();
    }

    // Initialize shayari database (fallback for demo)
    initShayariDatabase() {
        return {
            sad: [
                "تنہائیوں میں کھو گیا ہے میرا ہم سفر,\nآئینہ دکھاتا ہے اب فقط ایک بکھرا ہوا سا نظر۔\nہنسنا بھول گیا ہے دل مگر\nروتا بھی نہیں، کیونکہ آنسو بھی نہیں رہے بچ کر۔",
                "اکیلے پن کی چادر اوڑھے بیٹھا ہوں،\nزمانہ کہتا ہے دیوانہ بیٹھا ہوں۔\nجو روشنی تھی کبھی میرے دل میں،\nاب اُس بجھے چراغ کا پروانہ بیٹھا ہوں۔"
            ],
            love: [
                "تیری ہر ادائی پہ مرتا ہوں میں،\تیرے بنا اب تو رہتا نہیں ہے جی۔\nتُو مسکرائے تو بہار آ جائے،\nتُو روٹھے تو قیامت سی بیتتی ہے۔",
                "دِل کے دَر پہ تیری یادوں کا کارواں ہے،\nہر شام تیرے ناں سے روشن ہے۔\nتُو نے جو چھوا ہے اپنی وفا سے،\nہر زخم پہ اب ایک نیا جہاں ہے۔"
            ],
            angry: [
                "کیوں تو نے مجھ سے نظر چرائی ہے،\nکیوں اپنی وفاؤں کو رسوائی دی ہے؟\nجو تھے میرے، وہ اب پرائے ہو گئے،\nتُو نے غم کی ایسی کمائی دی ہے۔",
                "زخم بھی تیرے ہی ہیں، داغ بھی تیرے ہی ہیں،\nجو میں نے توڑے، وہ کچھ اور ہی کھیل تھے۔\nاب نہ ملو مجھ سے نظر کبھی،\nورنہ بھول نہ پاؤ گے وہ اندازِ جفا کے سلسلے۔"
            ],
            motivational: [
                "اپنے حوصلوں کا علم بلند رکھو،\nگرے تو سہی، پھر کھڑے ہونا بھی تو آتا ہے۔\nمنزل ملے نہ ملے، مگر چلتے رہو،\nہار تو وہीं ہوتا ہے جو تھم جاتا ہے۔",
                "اندھیرا چاہے جتنا بھی گہرا ہو،\nسویرا آتا ہے، اس میں شک نہیں۔\nجو پختہ ارادے رکھتا ہے اپنے دل میں،\nوہیں بدلتا ہے تقدیر کا شیوہ، اس میں شک نہیں۔"
            ]
        };
    }

    // Get mood prompt based on selection
    getMoodPrompt(mood, userInput, style) {
        const moodMap = {
            auto: "understand and match",
            sad: "express deep sadness and heartbreak",
            love: "express passionate love and affection",
            angry: "express anger and disappointment",
            motivational: "inspire and motivate"
        };
        
        return `You are a professional Urdu poet. Convert the user's sentence into beautiful Urdu shayari.
        
User sentence: "${userInput}"
Mood: ${moodMap[mood]}
Style: ${style}

Requirements:
- Write 2-4 lines of Urdu poetry
- Match the mood and context of user input
- Use simple but deep Urdu words
- Add rhyme (qafiya) if possible
- Make it emotional and human-like
- ${document.getElementById('emojiMode').checked ? 'Add 1-2 relevant emojis at the end' : 'No emojis'}
- Respond ONLY with the shayari text, no explanations`;
    }

    // For demo/local mode without API
    generateLocalShayari(input, mood, style) {
        let moodType = mood;
        if (mood === 'auto') {
            const autoDetect = ['sad', 'love', 'motivational'];
            moodType = autoDetect[Math.floor(Math.random() * autoDetect.length)];
        }
        
        const moodShayari = this.shayariDatabase[moodType] || this.shayariDatabase.sad;
        let selected = moodShayari[Math.floor(Math.random() * moodShayari.length)];
        
        // Add style modifier
        if (style === 'romantic') {
            selected = selected.replace('دوست', 'محبوب').replace('یاد', 'وصل');
        } else if (style === 'funny') {
            selected = "یاروں کے ساتھ یوں ہنستی ہے دنیا,\nدکھوں کو بھی چھپا لیتے ہیں مسکرا کر۔\nآپ نے پوچھا تو بتا دیا ورنہ,\nخوشی تو کب کی ملی ہوتی، بس مانگنا آتا نہیں۔\n😂";
        }
        
        // Add emojis if enabled
        if (document.getElementById('emojiMode').checked) {
            if (moodType === 'sad') selected += "\n\n💔😢";
            else if (moodType === 'love') selected += "\n\n❤️✨";
            else if (moodType === 'motivational') selected += "\n\n💪🌟";
        }
        
        return selected;
    }

    // Generate Roman Urdu transliteration (simplified)
    toRomanUrdu(urduText) {
        const translitMap = {
            'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ٹ': 't', 'ث': 's',
            'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ڈ': 'd',
            'ذ': 'z', 'ر': 'r', 'ڑ': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
            'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a',
            'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ک': 'k', 'گ': 'g', 'ل': 'l',
            'م': 'm', 'ن': 'n', 'و': 'w/o', 'ہ': 'h', 'ی': 'y', 'ے': 'e',
            'ہے': 'hai', 'میں': 'mein', 'تھا': 'tha', 'تھی': 'thi'
        };
        
        // Very simplified transliteration for demo
        let roman = urduText.replace(/[\u0600-\u06FF]/g, (match) => {
            return translitMap[match] || match;
        });
        
        // Replace common words
        roman = roman.replace(/(ہے)/g, 'hai').replace(/(میں)/g, 'mein');
        
        return roman;
    }

    // Generate shayari (API mode or local fallback)
    async generateShayari(input, mood, style) {
        if (!input.trim()) {
            throw new Error("Please enter a sentence first!");
        }

        // Check if OpenAI API is available (for production)
        const useAPI = false; // Set to true if you have backend API
        
        if (useAPI) {
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input, mood, style, emoji: document.getElementById('emojiMode').checked })
                });
                
                if (!response.ok) throw new Error('API failed');
                const data = await response.json();
                return data.shayari;
            } catch (error) {
                console.warn('API failed, using local database');
                return this.generateLocalShayari(input, mood, style);
            }
        } else {
            // Local mode - simulate delay for realism
            await new Promise(resolve => setTimeout(resolve, 1500));
            return this.generateLocalShayari(input, mood, style);
        }
    }

    // Display shayari
    async displayShayari() {
        const input = document.getElementById('userInput').value;
        const mood = document.getElementById('mood').value;
        const style = document.getElementById('style').value;
        
        const generateBtn = document.getElementById('generateBtn');
        const spinner = document.getElementById('loadingSpinner');
        const outputSection = document.getElementById('outputSection');
        
        try {
            // Show loading
            generateBtn.disabled = true;
            spinner.classList.remove('hidden');
            outputSection.classList.add('hidden');
            
            // Generate shayari
            this.currentShayari = await this.generateShayari(input, mood, style);
            this.currentRoman = this.toRomanUrdu(this.currentShayari);
            
            // Display output
            document.getElementById('shayariOutput').innerHTML = this.currentShayari.replace(/\n/g, '<br>');
            outputSection.classList.remove('hidden');
            
        } catch (error) {
            alert(error.message);
        } finally {
            generateBtn.disabled = false;
            spinner.classList.add('hidden');
        }
    }

    // Copy to clipboard
    copyToClipboard() {
        if (!this.currentShayari) return;
        
        navigator.clipboard.writeText(this.currentShayari).then(() => {
            const copyBtn = document.getElementById('copyBtn');
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        });
    }

    // Download as text
    downloadShayari() {
        if (!this.currentShayari) return;
        
        const content = `Shayari Reply AI\n\nUrdu Poetry:\n${this.currentShayari}\n\n${document.getElementById('romanUrduToggle').checked && this.currentRoman ? `Roman Urdu:\n${this.currentRoman}` : ''}`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shayari_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Toggle roman Urdu
    toggleRoman() {
        const romanOutput = document.getElementById('romanOutput');
        const toggle = document.getElementById('romanUrduToggle');
        
        if (toggle.checked && this.currentRoman) {
            romanOutput.innerHTML = this.currentRoman;
            romanOutput.classList.remove('hidden');
        } else {
            romanOutput.classList.add('hidden');
        }
    }

    // Regenerate shayari
    regenerate() {
        this.displayShayari();
    }

    // Initialize event listeners
    initEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.displayShayari());
        document.getElementById('generateAgainBtn').addEventListener('click', () => this.regenerate());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadShayari());
        document.getElementById('romanUrduToggle').addEventListener('change', () => this.toggleRoman());
        
        // Enter key shortcut
        document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.displayShayari();
            }
        });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.shayariApp = new ShayariAI();
});