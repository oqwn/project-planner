import React, { useState } from 'react';
import './CodeEditor.css';

interface CodeTemplate {
  language: string;
  template: string;
}

const codeTemplates: Record<string, CodeTemplate> = {
  javascript: {
    language: 'JavaScript',
    template: `// JavaScript solution
function solution(input) {
  // Your code here
  
  return result;
}

// Test cases
console.log(solution([1, 2, 3])); // Expected output`,
  },
  python: {
    language: 'Python',
    template: `# Python solution
def solution(input):
    # Your code here
    
    return result

# Test cases
print(solution([1, 2, 3]))  # Expected output`,
  },
  java: {
    language: 'Java',
    template: `// Java solution
class Solution {
    public static Object solution(Object input) {
        // Your code here
        
        return result;
    }
    
    public static void main(String[] args) {
        // Test cases
        System.out.println(solution(new int[]{1, 2, 3})); // Expected output
    }
}`,
  },
};

export const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(codeTemplates.javascript.template);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [problem] = useState(`# Two Sum Problem

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

## Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(codeTemplates[newLanguage].template);
  };

  const runCode = () => {
    // In a real implementation, this would send the code to a backend service
    // For now, we'll just simulate running the code
    setOutput(
      'Code execution simulated. In production, this would run on a secure backend.'
    );
  };

  return (
    <div className="code-editor">
      <div className="editor-header">
        <div className="language-selector">
          <label>Language:</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <button className="run-btn" onClick={runCode}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 2L12 8L4 14V2Z" fill="currentColor" />
          </svg>
          Run Code
        </button>
      </div>

      <div className="editor-content">
        <div className="problem-section">
          <h3>Problem</h3>
          <div className="problem-description">
            <pre>{problem}</pre>
          </div>
        </div>

        <div className="code-section">
          <div className="editor-area">
            <div className="line-numbers">
              {code.split('\n').map((_, index) => (
                <div key={index} className="line-number">
                  {index + 1}
                </div>
              ))}
            </div>
            <textarea
              className="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="output-section">
          <h3>Output</h3>
          <div className="output-area">
            <pre>{output || 'Run your code to see output here...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
