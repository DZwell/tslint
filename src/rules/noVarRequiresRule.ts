/*
 * Copyright 2014 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "require statement not part of an import statment";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new RequiresWalker(syntaxTree, this.getOptions()));
    }
}

class RequiresWalker extends Lint.RuleWalker {

    constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions) {
        super(syntaxTree, options);
    }

    public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax) {
        if (node.expression.isExpression()) {
            var expressionText = (<TypeScript.ISyntaxToken> node.expression).text();
            if (expressionText === "require") {
                // if we're using require as invocation then it's not part of an import statement
                var position = this.position() + node.leadingTriviaWidth();
                this.addFailure(this.createFailure(position, node.width(), Rule.FAILURE_STRING));
            }
        }
        super.visitInvocationExpression(node);
    }

}
