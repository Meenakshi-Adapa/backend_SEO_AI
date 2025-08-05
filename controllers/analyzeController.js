import { EnhancedAnalyzer } from '../services/enhancedAnalyzer.js';
import { generateParagraphRewrite } from '../services/paragraphRewriter.js';
import { generatePdfReport } from '../services/reportGenerator.js';
import Report from '../models/Report.js';

export const analyze = async (req, res) => {
  const { url, keywords } = req.body;
  if (!url || !keywords || !Array.isArray(keywords)) {
    return res.status(400).json({ error: 'Missing or invalid url or keywords in request body' }
    );
  }

  const analyzer = new EnhancedAnalyzer();

  try {
    const analysisResult = await analyzer.analyzeWebsite(url, keywords);

    // Save to database immediately after analysis
    const report = new Report({
      url,
      keywords,
      analysis: {
        metaTags: analysisResult.analysis.metaTags,
        keywordDensity: analysisResult.analysis.keywordDensity,
        pageSpeed: analysisResult.analysis.pageSpeed,
        mobileFriendly: analysisResult.analysis.mobileFriendly,
        readabilityScore: analysisResult.analysis.readabilityScore,
        semanticClarity: analysisResult.analysis.aiInsights.semanticClarity || "AI analysis failed.",
      },
      createdAt: new Date()
    });

    // Save immediately to ensure data persistence
    const savedReport = await report.save();

    // Generate comprehensive analysis for PDF
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
        aiInsights: analysisResult.analysis.aiInsights,
      },
      timestamp: new Date().toISOString()
    };

    // Generate PDF report
    const timestamp = Date.now();
    const pdfPath = `reports/report_${timestamp}.pdf`;
    await generatePdfReport(analysis, pdfPath);

    // Return the saved report with database ID
    res.json({
      ...analysisResult,
      reportId: report._id,
      pdfPath: pdfPath,
      savedToDatabase: true
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze the website' });
  }
};
