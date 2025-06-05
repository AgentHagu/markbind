/*
 Copyright (c) 2016-2018 Jay Hodgson

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */

// Process -> center text <-

'use strict';

module.exports = function centertext_plugin(md) {
  function centertextProcessor(state, startLine, endLine, silent) {
    const startPos = state.bMarks[startLine] + state.tShift[startLine];
    const endPos = state.eMarks[startLine];
    const line = state.src.slice(startPos, endPos).trim();

    if (!line.startsWith('->') || !line.endsWith('<-')) {
      return false;
    }

    if (silent) { return true; }

    var content = line.slice("->".length).trim();
    content = content.slice(0, content.length - "<-".length).trim();

    const tokenOpen = state.push('centertext_open', 'div', 1);
    tokenOpen.attrs = [ ['class', 'text-center'] ];

    const tokenContent = state.push('inline', '', 0);
    tokenContent.content = content;
    tokenContent.children = [];

    const tokenClose = state.push('centertext_close', 'div', -1);

    state.line = startLine + 1;
    return true;
  }

  md.block.ruler.before('blockquote', 'centertext', centertextProcessor);
};
