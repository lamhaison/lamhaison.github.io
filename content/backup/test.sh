cd $LHS_GITHHUB_PAGE_DIR

source content/backup/test_lib.sh
function extract_word() {
    # Remove space and extract the third field
    echo "$1" | awk -F ". " '{print $3}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'

}



# Check word by word
function _check_ai_generation() {
    local file="$1"

    echo "Preprocessing word: $2"
    local word=$(preprocess_word "$2")
    echo "Preprocessed word: $word"


    file=$(echo "$file" | sed 's/\.draft//')
    file_name=$(basename "$file")
    file_name=$(echo "$file_name" | sed 's/-draft//')

    (
        cd "$LHS_GITHHUB_PAGE_DIR/content/skill/languages/english" || exit 1
        data=$(cat "$file_name" | grep -i "${word}")

        if [[ -z "$data" ]]; then
            echo "Warning: Word '$word' not found in $file_name" "$1"
        fi
    )

}

function _check_result() {
    local file="$1"
    # Remove draft from file name
    file=$(echo "$file" | sed 's/\.draft//')
    local file_name=$(basename "$file")
    file_name=$(echo "$file_name" | sed 's/-draft//')
    local input_first_match=$(extract_word "$2")
    local input_end_match=$(extract_word "$3")


    (
        cd "$LHS_GITHHUB_PAGE_DIR/content/skill/languages/english"
        local file_name="$file_name"
        echo "Checking result for $file_name"
        echo "First match: $input_first_match"
        echo "End match: $input_end_match"

        data=$(cat "$file_name" | grep -E "## \d+")
        local first_match=$(extract_word "$(echo "$data" | head -n 1)")
        local end_match=$(extract_word "$(echo "$data" | tail -n 1)")

        echo "File: $file_name"

        if [[ "$input_first_match" != "$first_match" || "$input_end_match" != "$end_match"  ]]; then
            echo "Warning: Input does not match actual in $file_name" "$1"
            echo "Warning: Expected first match: $input_first_match"
            echo "Warning: Actual first match: $first_match"
            echo "Warning: Expected end match: $input_end_match"
            echo "Warning: Actual end match: $end_match"
        fi

    )
}

for file in $(find content/backup/** -type f | grep -v "test.sh" | grep "american-oxford" | sort); do
    echo "Processing $file"

    data=$(cat "$file" | grep -E "## \d+")
    first_match=$(echo "$data" | head -n 1)
    echo "First match: $first_match"
    end_match=$(echo "$data" | tail -n 1)
    echo "End match: $end_match"
    _check_result "$file" "$first_match" "$end_match"

    # treat each line matching '## \d+' as a word to check with _check_ai_generation instead of splitting by spaces
    grep -E "## \d+" "$file" | while IFS= read -r word; do
        echo "Checking word: $word"
        _check_ai_generation "$file" "$word"
    done
    echo "Finished processing $file"
    echo "----------------------------------------"
done



