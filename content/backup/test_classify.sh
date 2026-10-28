cd $LHS_GITHHUB_PAGE_DIR

source content/backup/test_lib.sh

# Working follow.
# To create a script to allow classify words base on level
# level 0 - don't know the meaing
# level 1 - I can recognize the word but don't fully understand it
# level 2 - I can recognize the word and understand its meaning when reading and listening
# level 3 - I can use the word but I need time to recall it
# level 4 - native-like proficiency (need practice to maintain) - at least 1 time use it in a real context

# content/skill/languages/english/001-american-oxford-3000-level-0-unknow.doc.md
# content/skill/languages/english/001-american-oxford-3000-level-1-familar.doc.md
# content/skill/languages/english/001-american-oxford-3000-level-2-passive.doc.md
# content/skill/languages/english/001-american-oxford-3000-level-3-control-production.doc.md
# content/skill/languages/english/001-american-oxford-3000-level-4-native.doc.md

# the first function is to get latest word that is classified into a specific level

function get_latest_word_by_level() {
    cat content/skill/languages/english/001-american-oxford-3000-level-*.doc.md \
  | grep -E "^## [0-9]+\." \
  | sort -t' ' -k2,2n | tail -n 1
}

function get_next_word_by_level() {
    local work_number="$1"
    cat content/skill/languages/english/american-oxford-3000-*-*.doc.md \
  | grep -E "^## ${work_number}\. " \
  | sort -t' ' -k2,2n | tail -n 1
}


# 
## 18. accurate

# - Type: Adjective
# - CEFR Level: B2
# - IPA (US): /ˈækjərət/
# - English Meaning: Correct and precise.
# - Vietnamese Meaning: Chính xác.
# - Example: The report contains accurate information.
# - Example Translation: Báo cáo chứa thông tin chính xác.

## 19. accuse

# Get inside 
## 18. accurate

# - Type: Adjective
# - CEFR Level: B2
# - IPA (US): /ˈækjərət/
# - English Meaning: Correct and precise.
# - Vietnamese Meaning: Chính xác.
# - Example: The report contains accurate information.
# - Example Translation: Báo cáo chứa thông tin chính xác.


extract_the_word() {
    local heading="$1"

    awk -v heading="$heading" '
    $0 == heading {
        found=1
    }

    found {
        if ($0 ~ /^## / && $0 != heading)
            exit
        print
    }
    ' content/skill/languages/english/american-oxford-3000-*-*.doc.md
}

function write_the_word_to_level() {
    local word="$1"
    local file_name=$2


    echo "$word" >> "$file_name"
    echo "" >> "$file_name"
    echo "" >> "$file_name"
    
}

while true; do

# set -x
latest_word=$(get_latest_word_by_level "")
# Extract the number of the latest word heading
latest_word_number=$(echo "$latest_word" | grep -oE "^[^#]*## [0-9]+" | grep -oE "[0-9]+")
# +1
next_word_number=$((latest_word_number + 1))
next_word=$(get_next_word_by_level "$next_word_number")
echo "Next word for level 0: $next_word"
echo "Latest word number for level 0: $next_word_number"
echo "Latest word for level 0: $latest_word"
echo "Extracting context for the latest word..."
word=$(extract_the_word "$next_word")
echo "Extracted word context:"
echo "$word"

# create promt to classify the extracted word into a specific level
# shellcheck disable=SC2148
# Reference: 

echo ""
echo "Classify the following word into a specific level:"


echo "Do you want to go next step for classifying the word '$next_word'?"
echo "Enter your choice (0-4) or 'no' to skip:"
echo "level 0 - don't know the meaning"
echo "level 1 - I can recognize the word but don't fully understand it"
echo "level 2 - I can recognize the word and understand its meaning when reading and listening"
echo "level 3 - I can use the word but I need time to recall it"
echo "level 4 - near-native-like proficiency (need practice to maintain) - at least 1 time use it in a real context"
echo "level 5 - native-like proficiency (need practice to maintain) - use it in a real context frequently"

read input_user

# Switch case based on user input
case "$input_user" in
    0)
        echo "Level 0"
        write_the_word_to_level "$word" content/skill/languages/english/001-american-oxford-3000-level-0-unknow.doc.md
        ;;
    1)
        echo "Level 1"
        write_the_word_to_level "$word" content/skill/languages/english/001-american-oxford-3000-level-1-familiar.doc.md
        ;;
    2)
        echo "Level 2"
        write_the_word_to_level "$word" content/skill/languages/english/001-american-oxford-3000-level-2-passive.doc.md
        ;;
    3)
        echo "Level 3"
        write_the_word_to_level "$word" content/skill/languages/english/001-american-oxford-3000-level-3-control-production.doc.md
        ;;
    4)
        echo "Level 4"
        write_the_word_to_level "$word" content/skill/languages/english/001-american-oxford-3000-level-4-near-native.doc.md
        ;;
    5)
        echo "Level 5"
        write_the_word_to_level "$word" content/skill/languages/english/001-american-oxford-3000-level-5-native.doc.md
        ;;
    no|n|N)
        echo "Skip and return"
        ;;
    *)
        echo "Invalid input"
        ;;
esac
done
# set +x