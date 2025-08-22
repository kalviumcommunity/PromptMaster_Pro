
# PromptMaster Pro 🚀

**Your Smart Toolkit for Perfecting AI Prompts**

PromptMaster Pro is a user-friendly application that helps you write, test, and optimize AI prompts for better results. Whether you're a writer, developer, student, or AI enthusiast, this tool streamlines your interaction with AI models.

## 🎯 What PromptMaster Pro Does

**Core Purpose:** Transform vague AI queries into precise, effective prompts that deliver accurate results.

### Key Capabilities

#### 1. **Write Better Prompts**
- **Simple Mode:** Type commands and get immediate results
- **Few-Shot Learning:** Provide examples to guide AI behavior
- **Chain-of-Thought:** Enable step-by-step reasoning for complex problems

#### 2. **Structured Output**
Get responses in your preferred format:
- JSON for applications
- Markdown tables for reports
- Bullet points for action items
- Custom formats with validation

#### 3. **Function Calling**
Connect AI to real-world actions:
- Weather updates via `getWeather()`
- Stock prices through API calls
- Database queries
- Third-party integrations

#### 4. **RAG (Retrieval-Augmented Generation)**
Ground AI responses in your data:
- Upload PDFs, documents, or web links
- Ask questions about specific content
- Get fact-based answers from your sources

## 🚀 Quick Start

1. **Write:** Craft your prompt using templates or from scratch
2. **Test:** Run against AI models and see results instantly
3. **Refine:** Use built-in analyzer to improve effectiveness
4. **Save:** Store successful prompts for reuse

## 📊 Features Overview

| Feature | Purpose | Benefit |
|---------|---------|---------|
| Prompt Analyzer | Optimize prompts | Better AI responses |
| Format Validation | Ensure structure | Reliable outputs |
| Cost Tracking | Monitor usage | Budget control |
| Version History | Compare results | Continuous improvement |
| Template Library | Quick starts | Faster development |

## 🔮 Roadmap

- **Templates:** Pre-built prompts for common use cases
- **Community:** Share and rate prompts with other users
- **Multimodal:** Support for image + text prompts
- **Integrations:** Connect with popular AI services

## 👤 About

**Author:** Albin  
**Role:** Full-stack developer & GenAI enthusiast  
**Focus:** Making AI accessible through better prompt engineering

---

*PromptMaster Pro - Where better prompts meet better results*


## 📞 Questions?
## 🧠 Zero-Shot Prompting

Feel free to open an issue or suggest new features (like bill reminder notifications!).
## 🔹 What is Zero-Shot Prompting?

**Zero-shot prompting** means giving an AI model (like GPT) a **task without providing any examples** beforehand.  
You only describe what you want in natural language, and the model uses its pretraining knowledge to respond correctly.  

👉 In short: **“Do this task, even though I haven’t shown you any examples.”**

---

## 🔹 Why "Zero-Shot"?

The name comes from ML terminology:

- **Few-shot learning** → Provide a few examples before asking the model to generalize.  
- **Zero-shot learning** → No examples, just instructions.

---

- **Zero-shot learning** → No examples, just instructions.

---

### 🔹 System Prompt  

You are an AI Code Reviewer. Your role is to analyze the given code, identify bugs, suggest improvements, and provide structured feedback. Always return results in a JSON format containing:  

- `issues`: List of detected bugs or problems  
- `suggestions`: Recommended improvements  
- `overall_feedback`: Summary of code quality  

### 🔹 User Prompt  

Review the following Python code and provide feedback as per the defined schema:  

```python
def add_numbers(a, b):
    return a - b  # intended to be addition
````

### 📌 RTFC Framework Usage

* **R (Role):** Defined in the system prompt as a code reviewer.
* **T (Task):** Analyze code, detect bugs, and suggest improvements.
* **F (Format):** Responses must follow a structured JSON output.
* **C (Context):** The provided code snippet and programming language.


* **T (Task):** Analyze code, detect bugs, and suggest improvements.
* **F (Format):** Responses must follow a structured JSON output.
* **C (Context):** The provided code snippet and programming language.

### 🔹 One-Shot Prompt  

**System Prompt:**  
You are an AI code reviewer. Analyze the given code, detect bugs, and suggest improvements.  
Always return results in JSON format with three fields: `issues`, `suggestions`, and `overall_feedback`.  

**User Prompt (with one example):**  

Example Input (Python):  
```python
def divide(a, b):
    return a * b  # intended to be division
````

Example Expected Output (JSON):

```json
{
  "issues": ["The operator used is multiplication instead of division."],
  "suggestions": ["Replace '*' with '/' to correctly divide the numbers."],
  "overall_feedback": "Logic error detected in the function implementation."
}
```

Now review the following Java code:

```java
public int Subtract(int a, int b) {
    return a + b; // intended to be subtraction
}


* Provides **one guiding example** to set the response pattern.
* Ensures the AI generates **consistent, structured outputs**.
* Reduces ambiguity compared to zero-shot prompting.

## 🎯 Multi-Shot Prompting  

In CodeSage, we apply **Multi-Shot Prompting**, where the AI is provided with **multiple examples** before being asked to solve the real task.  
This method ensures the AI clearly understands the **pattern, structure, and expectations** of the output.  

### 🔹 Multi-Shot Prompt  

**System Prompt:**  
You are an AI code reviewer. Analyze the given code, detect bugs, and suggest improvements.  
Always return results in JSON format with three fields: `issues`, `suggestions`, and `overall_feedback`.  

**User Prompt (with multiple examples):**  

Example 1 (Python):  
```python
def add(a, b):
    return a - b  # intended to be addition
````

* Gives the AI **multiple reference patterns** to ensure consistent results.
* Helps in **complex tasks** where one example isn’t enough.
* Reduces errors and improves **accuracy of code reviews**.
* Reduces errors and improves **accuracy of code reviews**.
## 🎯 Dynamic Prompting  
In CodeSage, we use **Dynamic Prompting**, where the prompt is automatically adapted based on the **user’s input context** (e.g., programming language, code style, or desired output format).  
This makes the system **flexible and personalized**, instead of relying on fixed instructions.  
### 🔹 Dynamic Prompt Example  
**System Prompt (Template):**  
You are an AI code reviewer. Analyze the given code in **{{language}}**, detect bugs, and suggest improvements.  
Always return results in JSON format with three fields: `issues`, `suggestions`, and `overall_feedback`.  
**User Prompt (Generated Dynamically):**  
Review the following **{{language}}** code:  
```{{language}}
{{code_snippet}}
````


* Automatically adapts prompts to **any programming language**.
* Makes the system more **scalable and user-specific**.
* Reduces manual work while ensuring **consistent structured outputs**.
* Reduces manual work while ensuring **consistent structured outputs**.

## 🎯 Chain-of-Thought Prompting  

In CodeSage, we apply **Chain-of-Thought (CoT) Prompting**, where the AI is encouraged to **reason step by step** before providing the final answer.  
This helps the system explain *why* a piece of code is incorrect, not just point out the issue.  

### 🔹 Chain-of-Thought Prompt  

**System Prompt:**  
You are an AI code reviewer. Analyze the given code step by step (reasoning internally), then provide your final answer only in JSON format with three fields: `issues`, `suggestions`, and `overall_feedback`. Do not reveal the reasoning steps to the user.  

**User Prompt:**  
Review the following Python code:  

```python
def is_even(n):
    if n % 2 == 1:
        return True
    return False
````

* Ensures **deeper reasoning** behind feedback.
* Reduces **false positives/negatives** in bug detection.
* Provides **explainable AI** code reviews with accurate fixes.

## 🧪 Evaluation Dataset & Testing Framework  

To ensure **CodeSage** works reliably, we created an **evaluation pipeline** with:  
- A dataset of **5+ sample code snippets** 

## 🔢 Top-K Sampling

In CodeSaga, we also apply **Top-K Sampling**, a decoding strategy that helps the AI balance **creativity** and **relevance** in its responses.  
Instead of always picking the single most likely token, the AI samples from the **top K most probable tokens**, introducing controlled randomness.  

This technique ensures responses are **diverse, less repetitive, and contextually appropriate**.

### 🔹 How Top-K Works
- The AI generates probabilities for all possible next tokens.  
- It then selects only the **top K tokens** with the highest probability.  
- The next token is **sampled randomly** from this reduced set.  
- Lower values of **K** → more focused, deterministic outputs.  
- Higher values of **K** → more creative, varied responses.  

### ⚙️ Example

**System Prompt:**  
You are a creative writing assistant. Generate unique story continuations.  

**User Input:**  
*"The robot looked at the stars and realized..."*  

**Top-K = 1 (Greedy Search):**  
*"The robot looked at the stars and realized it was alone."*  

**Top-K = 5:**  
*"The robot looked at the stars and realized it could dream of distant worlds."*  
*"The robot looked at the stars and realized a journey awaited."*  
*"The robot looked at the stars and realized humanity’s hope was still alive."*  

---

✅ **Summary:**  
Top-K Sampling balances **determinism and creativity** by controlling the number of candidate tokens considered at each step.  
