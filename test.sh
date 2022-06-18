#!/bin/bash

TESTS_FILE="src/__tests__/cpu.test.ts"
ASM=".text
    mov r0, #1"

while getopts n:c: flag
do
    case "${flag}" in
        n) newtest=${OPTARG^^};;
    esac
done

# Check if the new test is defined
if [ -n "${newtest}" ]; then
    # Check if the new test is already defined
    if grep -q "test('${newtest}'" "${TESTS_FILE}"; then
        echo "Test '${newtest}' is already defined!"
        exit 1
    else
        # Add the new test
        echo "Adding test '${newtest}' to the test suite"
        printf "\ntest('${newtest}', () => {\n\tconst test_name = expect.getState().currentTestName.toLowerCase();\n\trunTest(test_name);\n});\n" >> "${TESTS_FILE}"
        
        # Create the test.S file for the new test if it doesn't exist
        if [ ! -f "src/__tests__/asm/${newtest,,}.S" ]; then
            echo "Creating .S file for test '${newtest}'"
            echo "${ASM}" > "src/__tests__/asm/${newtest,,}.S"
        else
            echo "The ${newtest,,}.S file already exists!"
        fi
    fi
fi

echo ""
echo "Running tests..."
yarn test