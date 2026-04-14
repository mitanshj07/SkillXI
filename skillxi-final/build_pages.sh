#!/bin/bash
# SkillXI Page Builder Script
# Copies source files and wraps them with unified head/nav/footer

DEST="/Users/mitansh7/Desktop/SkillXI-web-project/skillxi-final"
SRC="/Users/mitansh7/Desktop/SkillXI-web-project"

# For each source file, we:
# 1. Copy it to the destination
# 2. The pages already have their own embedded nav, styles, and tailwind config
# 3. We add the external CSS/JS links

# Since sed is limited, we'll use a simpler approach:
# Copy each source file directly and just add our CSS/JS links

PAGES=(
    "lineup.html|stitch_step_wise_extraction_tool 2/skillxi_lineup_builder/code.html"
    "leaderboard.html|stitch_step_wise_extraction_tool 2/skillxi_live_leaderboard/code.html"
    "payout.html|stitch_step_wise_extraction_tool 2/skillxi_contest_results_payout/code.html"
    "player-analysis.html|stitch_step_wise_extraction_tool 2/skillxi_player_analysis_detail/code.html"
    "ai-chat.html|stitch_step_wise_extraction_tool 2/skillxi_ai_analyst_chat/code.html"
    "profile.html|stitch_step_wise_extraction_tool 2/skillxi_user_profile_skill_score/code.html"
    "subscription.html|stitch_step_wise_extraction_tool 2/skillxi_subscription_plans/code.html"
    "pre-match.html|stitch_step_wise_extraction_tool 2/skillxi_pre_match_intelligence_report/code.html"
    "onboarding.html|stitch_step_wise_extraction_tool 3/skillxi_web3_onboarding/code.html"
    "wallet.html|stitch_step_wise_extraction_tool 3/skillxi_wallet_history/code.html"
    "nexus-feed.html|stitch_step_wise_extraction_tool 3/skillxi_nexus_feed/code.html"
    "roster-lab.html|stitch_step_wise_extraction_tool 5/roster_lab_cyberpunk_edition/code.html"
    "global-leaderboard.html|stitch_step_wise_extraction_tool 5/skillxi_global_leaderboard/code.html"
)

for entry in "${PAGES[@]}"; do
    IFS='|' read -r dest_name src_path <<< "$entry"
    src_file="$SRC/$src_path"
    dest_file="$DEST/$dest_name"
    
    if [ -f "$src_file" ]; then
        # Copy source file
        cp "$src_file" "$dest_file"
        
        # Add external CSS link after the existing style imports
        # We use sed to insert our CSS link before </head>
        sed -i '' 's|</head>|<link rel="stylesheet" href="assets/css/style.css"/>\n</head>|' "$dest_file"
        
        # Add external JS before </body>
        sed -i '' 's|</body>|<script src="assets/js/main.js"></script>\n</body>|' "$dest_file"
        
        # Fix internal navigation links - replace # hrefs in nav items
        # Replace href="#" in specific nav patterns with actual page links
        
        echo "✅ Created: $dest_name (from $src_path)"
    else
        echo "❌ Source not found: $src_file"
    fi
done

echo ""
echo "🎉 All pages created! Now applying navigation link fixes..."

# Fix navigation links across ALL pages (including index.html and contests.html)
for file in "$DEST"/*.html; do
    # Replace Stitch placeholder links
    sed -i '' "s|{{DATA:SCREEN:SCREEN_27}}|index.html|g" "$file"
    sed -i '' "s|{{DATA:SCREEN:SCREEN_28}}|index.html|g" "$file"
    sed -i '' "s|{{DATA:SCREEN:SCREEN_10}}|wallet.html|g" "$file"
    sed -i '' "s|{{DATA:SCREEN:SCREEN_12}}|roster-lab.html|g" "$file"
    sed -i '' "s|{{DATA:SCREEN:SCREEN_31}}|global-leaderboard.html|g" "$file"
    sed -i '' "s|{{DATA:SCREEN:SCREEN_32}}|lineup.html|g" "$file"
    sed -i '' "s|{{DATA:SCREEN:SCREEN_41}}|subscription.html|g" "$file"
    
    echo "  🔗 Fixed links in: $(basename $file)"
done

echo ""
echo "✅ Build complete! All 15 pages ready in $DEST/"
ls -la "$DEST"/*.html | wc -l
echo " HTML files created"
