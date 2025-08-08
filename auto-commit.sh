#!/bin/bash

# Auto-commit script for Restaurant Portfolio Project
# This script automatically commits changes to GitHub

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/AsithaLKonara/Restaurent-Portfolio-with-order-management.git"
BRANCH="main"

echo -e "${BLUE}🚀 Starting Auto-Commit Process...${NC}"

# Function to check if git is initialized
check_git() {
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}📁 Initializing Git repository...${NC}"
        git init
        git remote add origin $REPO_URL
    fi
}

# Function to stage and commit changes
commit_changes() {
    local phase=$1
    local message=$2
    
    echo -e "${BLUE}📝 Committing Phase $phase: $message${NC}"
    
    # Add all changes
    git add .
    
    # Commit with descriptive message
    git commit -m "Phase $phase: $message
    
    - Implemented $message
    - Added new features and improvements
    - Updated documentation and configuration"
    
    # Push to remote repository
    git push origin $BRANCH
    
    echo -e "${GREEN}✅ Phase $phase committed successfully!${NC}"
}

# Function to show what files changed
show_changes() {
    echo -e "${YELLOW}📋 Files changed in this commit:${NC}"
    git diff --cached --name-only | while read file; do
        echo -e "  📄 $file"
    done
}

# Main execution
main() {
    check_git
    
    # Get current phase from command line argument
    PHASE=${1:-1}
    MESSAGE=${2:-"Core Production Upgrade"}
    
    echo -e "${GREEN}🔄 Committing Phase $PHASE: $MESSAGE${NC}"
    
    # Stage and commit
    commit_changes $PHASE "$MESSAGE"
    
    # Show what changed
    show_changes
    
    echo -e "${GREEN}🎉 Auto-commit completed successfully!${NC}"
    echo -e "${BLUE}🌐 Repository: $REPO_URL${NC}"
}

# Run main function with arguments
main "$@"
