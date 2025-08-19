import ast

class ComplexityAnalyzer(ast.NodeVisitor):
    def __init__(self):
        self.max_depth = 0
        self.recursive = False

    def visit_FunctionDef(self, node):
        # Check recursion: does function call itself?
        for child in ast.walk(node):
            if isinstance(child, ast.Call) and isinstance(child.func, ast.Name):
                if child.func.id == node.name:
                    self.recursive = True
        self.generic_visit(node)

    def visit_For(self, node):
        self._process_loop(node)

    def visit_While(self, node):
        self._process_loop(node)

    def _process_loop(self, node, depth=1):
        # Compute nesting depth
        self.max_depth = max(self.max_depth, depth)
        for child in node.body:
            if isinstance(child, (ast.For, ast.While)):
                self._process_loop(child, depth + 1)
            else:
                self.visit(child)

    def get_complexity(self):
        # Convert metrics into human-readable complexity
        if self.max_depth == 0 and not self.recursive:
            return "O(1)"  # constant
        elif self.recursive and self.max_depth == 0:
            return "O(n)"  # simple recursion
        elif self.recursive and self.max_depth > 0:
            return f"O(n^{self.max_depth + 1})"  # recursion + loops
        else:
            return f"O(n^{self.max_depth})"  # pure loops
