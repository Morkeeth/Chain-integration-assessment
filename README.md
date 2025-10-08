# Chain Integration Assessment Application

AI-powered blockchain integration complexity assessment tool for Ledger engineers.

## 🚀 Features

- **AI-Powered Analysis**: GPT-4 powered complexity assessment with real-time streaming
- **Auto-Discovery**: Automatically finds RPC endpoints, chain IDs, block explorers, and GitHub repos
- **Code Generation**: Ready-to-use Ledger integration code with all variables
- **Real-Time Assessment**: Live analysis with progress tracking and step-by-step updates
- **Minimal UI**: Clean, monochrome interface focused on functionality
- **Navigation**: Smooth page transitions with back/forth navigation
- **API Protection**: Secure deployment with API key authentication

## 🛠️ Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **OpenAI GPT-4** for AI analysis
- **Radix UI** components
- **Lucide React** icons

## 📦 Installationa

```bash
# Clone the repository
git clone https://github.com/your-username/chain-integration-assessment.git
cd chain-integration-assessment

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

## 🔧 Environment Variables

Create a `.env.local` file:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# App API Key (for protecting your OpenAI key when deployed)
APP_API_KEY=your_app_api_key_here

# Next.js App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel Deployment

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `APP_API_KEY`: A secure random string
     - `NEXT_PUBLIC_APP_URL`: Your Vercel domain

2. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

### API Protection

The app includes API key protection to prevent unauthorized use of your OpenAI API key:

- Set `APP_API_KEY` environment variable
- Requests require `x-api-key` header
- See `DEPLOYMENT.md` for detailed setup

## 🎯 Usage

1. **Enter Chain Name**: Type any blockchain name (e.g., Ethereum, SUI, Babylon)
2. **AI Analysis**: Watch real-time analysis with 4 progress steps
3. **View Results**: Get comprehensive assessment with generated code
4. **Navigate**: Use back/forth navigation between pages

## 📊 Recent Integrations

The app showcases recent Ledger integrations:

- **SUI** - Move-based blockchain (Medium complexity)
- **Babylon** - Bitcoin staking protocol (High complexity)
- **Hedera** - Hashgraph consensus (Medium-High complexity)
- **Base** - Coinbase L2 (Low complexity)
- **Arbitrum** - L2 rollup (Low complexity)
- **Celestia** - Modular blockchain (Medium complexity)
- **Sei** - Parallelized EVM (Low-Medium complexity)
- **Aptos** - Move-based blockchain (Medium complexity)

## 🔍 Analysis Features

- **Complexity Assessment**: LOW/MEDIUM/HIGH with detailed reasoning
- **Timeline Estimation**: Realistic development timeframes
- **Action Checklist**: Specific, actionable integration tasks
- **Red Flags**: Critical issues and security concerns
- **Recommendations**: Strategic guidance for successful integration
- **Generated Code**: Ready-to-use Ledger integration code

## 🎨 UI/UX

- **Minimal Design**: Clean, monochrome black and white interface
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive**: Works on all screen sizes
- **Navigation**: Intuitive back/forth page navigation
- **Loading States**: Real-time progress with step indicators

## 🔒 Security

- **API Key Protection**: Secure deployment with authentication
- **Environment Variables**: Secure key management
- **Rate Limiting**: Built-in protection against abuse
- **Input Validation**: Secure data handling

## 📁 Project Structure

```
chain-assessment/
├── app/
│   ├── api/
│   │   ├── real-analyze/     # Main analysis endpoint
│   │   └── auth/             # API authentication
│   ├── components/
│   │   ├── minimal-hero.tsx
│   │   ├── minimal-assessment-form.tsx
│   │   ├── analysis-loading.tsx
│   │   ├── code-results.tsx
│   │   ├── navigation-header.tsx
│   │   └── command-palette.tsx
│   ├── lib/
│   │   ├── openai.ts
│   │   ├── blockchain-data.ts
│   │   └── utils.ts
│   └── types/
│       └── assessment.ts
├── components/ui/            # Reusable UI components
├── DEPLOYMENT.md            # Deployment guide
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the deployment guide
- Review environment variable setup

## 🎯 Demo

Visit the live demo at: [Your Vercel URL]

**Demo Flow:**
1. Enter a blockchain name (e.g., "Babylon")
2. Watch the AI analysis progress
3. Review the comprehensive results
4. Copy the generated integration code

---

Built with ❤️ for the Ledger development team