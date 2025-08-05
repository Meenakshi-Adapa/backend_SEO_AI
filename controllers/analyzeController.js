import { EnhancedAnalyzer } from '../services/enhancedAnalyzer.js';
import { generateParagraphRewrite } from '../services/paragraphRewriter.js';
import { generatePdfReport } from '../services/reportGenerator.js';

export const analyze = async (req, res) => {
  const { url, keywords } = req.body;
  if (!url || !keywords || !Array.isArray(keywords)) {
    return res.status(400).json({ error: 'Missing or invalid url or keywords in request body' }
    );
  }

  const analyzer = new EnhancedAnalyzer();

  try {
    const analysisResult = await analyzer.analyzeWebsite(url, keywords);

    // Generate comprehensive analysis
    const analysis = {
      url,
      keywords,
      analysis: {
        metaTags: analysisResult.analysis.metaTags,
        keywordDensity: analysisResult.analysis.keywordDensity,
        pageSpeed: analysisResult.analysis.pageSpeed,
        mobileFriendly: analysisResult.analysis.mobileFriendly,
        readabilityScore: analysisResult.analysis.readabilityScore,
        semanticClarity: analysisResult.analysis.aiInsights.semanticClarity || "AI analysis failed.",
        internalPages: analysisResult.analysis.internalPages,
        internalPagesSuggestions: analysisResult.analysis.internalPagesSuggestions,
        homepageSuggestions: analysisResult.analysis.homepageSuggestions,
        structuredDataPresent: analysisResult.analysis.structuredData,
        sampleParagraph: analysisResult.analysis.sampleParagraph,
        rewrittenParagraph: analysisResult.analysis.rewrittenParagraph,
        semanticClarity: analysisResult.analysis.aiInsights.semanticClarity || "AI analysis failed.",
        structuredData: analysisResult.analysis.structuredData,
        sampleParagraph: analysisResult.analysis.sampleParagraph,
        rewrittenParagraph: analysisResult.analysis.rewrittenParagraph,
        aiInsights: analysisResult.analysis.aiInsights,
      },
      timestamp: new Date().toISOString()
    };

    res.json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze the website' });
  }
};
