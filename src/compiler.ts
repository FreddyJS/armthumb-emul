const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

enum Operation {
  MOV,
  ADD,
  TOTAL_OPERATIONS,
}

const wordToOperation: { [key: string]: Operation } = {
  mov: Operation.MOV,
  add: Operation.ADD,
};

enum OperandType {
  LowRegister,
  HighRegister,
  SpRegister,
  HexInmediate,
  DecInmediate,
}

type CompilerError = {
  message: string;
  line: number;
  column: number;
};

type Operand = {
  type: OperandType;
  value: string;
};

type Instruction = {
  operation: Operation;
  operands: Operand[];
};

type Program = {
  error?: CompilerError;
  ins: Instruction[];
};

function isGeneralReg(type: OperandType): boolean {
  return type === OperandType.LowRegister || type === OperandType.HighRegister;
}

function isInmediateVal(type: OperandType): boolean {
  return type === OperandType.HexInmediate || type === OperandType.DecInmediate;
}

function stripComments(source: string) {
  return source
    .split('\n')
    .map((line) => {
      let commentIndex = line.indexOf(';');
      commentIndex = commentIndex === -1 ? line.indexOf('@') : commentIndex;
      if (commentIndex === -1) {
        return line.trim();
      } else {
        return line.slice(0, commentIndex).trim();
      }
    })
    .join('\n');
}

function stripEmptyLines(source: string) {
  return source
    .split('\n')
    .filter((line) => line.length > 0)
    .join('\n');
}

function cleanInput(source: string): string {
  return stripEmptyLines(stripComments(source)).toLowerCase();
}

function operandToOptype(operand: string): OperandType | undefined {
  if (operand.startsWith('r')) {
    // Register Operand
    const reg = parseInt(operand.slice(1), 10);
    if (reg >= 0 && reg <= 7) {
      return OperandType.LowRegister;
    } else if (reg >= 8 && reg <= 15) {
      return OperandType.HighRegister;
    }
  } else if (operand.startsWith('#')) {
    if (operand.startsWith('#0x')) {
      if (!isNaN(operand.slice(1) as any)) {
        return OperandType.HexInmediate;
      }
    } else if (!isNaN(operand.slice(1) as any)) {
      return OperandType.DecInmediate;
    }
  } else if (operand === 'sp') {
    return OperandType.SpRegister;
  }

  return undefined;
}

function lineToInstruction(line: string): Instruction | string {
  const words = line.split(' ');
  const operands = words
    .slice(1)
    .join(' ')
    .split(',')
    .map((operand) => operand.trim());

  const operation = wordToOperation[words[0]];
  if (operation === undefined) {
    return 'Unknown operation: ' + words[0];
  }

  assert(Operation.TOTAL_OPERATIONS === 2, 'Exhaustive handling of operations in line_to_op');
  switch (operation) {
    case Operation.MOV: {
      if (operands.length !== 2) {
        return 'Invalid number of operands for MOV. Expected 2, got ' + operands.length;
      }
      
      const op1Type = operandToOptype(operands[0]);
      const op2Type = operandToOptype(operands[1]);

      if (op1Type === undefined || !isGeneralReg(op1Type)) {
        return 'Invalid operand 1 for MOV. Expected register, got ' + operands[0];
      } else if (op2Type === undefined) {
        return 'Invalid operand 2 for MOV. Expected register or #8bit_Inm, got ' + operands[1];
      }

      // Second operand is a register (low or high)
      if (isGeneralReg(op2Type)) {
        // CASE: MOV r1, r2
        return {
          operation: Operation.MOV,
          operands: [
            { type: op1Type, value: operands[0] },
            { type: op2Type, value: operands[1] },
          ],
        };
      }

      // Second operand is an inmediate (hex or dec) value
      if (isInmediateVal(op2Type)) {
        const radix = op2Type === OperandType.HexInmediate ? 16 : 10;
        const value = parseInt(operands[1].slice(1), radix);
        if (value < 0 || value > 255) {
          return 'Invalid inmediate for MOV. Number out of range. Expected 0-255 but got ' + value;
        } else if (op1Type === OperandType.HighRegister) {
          return 'Invalid register for MOV. Only low registers are allowed with inmediate values';
        }

        // CASE: MOV r1, #0xFF
        return {
          operation: Operation.MOV,
          operands: [
            { type: op1Type, value: operands[0] },
            { type: op2Type, value: operands[1] },
          ],
        };
      } else {
        return 'Invalid operand 2 for MOV. Expected register or #8bit_Inm, got ' + operands[1];
      }
    }

    case Operation.ADD: {
      if (operands.length != 2 && operands.length != 3) {
        return 'Invalid number of operands for ADD';
      }

      const op1Type = operandToOptype(operands[0]);
      const op2Type = operandToOptype(operands[1]);
      if (op1Type === undefined || (!isGeneralReg(op1Type) && op1Type !== OperandType.SpRegister)) {
        return 'Invalid operand 1 for ADD. Expected r[0-15] or sp, got ' + operands[0];
      } else if (op2Type === undefined) {
        return 'Invalid operand 2 for ADD. Expected register or #8bit_Inm, got ' + operands[1];
      }

      if (operands.length === 2) {
        if (op1Type === OperandType.SpRegister) {
          if (isInmediateVal(op2Type)) {
            const radix = op2Type === OperandType.HexInmediate ? 16 : 10;
            const value = parseInt(operands[1].slice(1), radix);
            if (value < -128 || value > 127) {
              return 'Invalid inmediate for ADD. Number out of range. Expected -128-127 but got ' + value;
            }

            // CASE: ADD sp, #0xFF
            return {
              operation: Operation.ADD,
              operands: [
                { type: op1Type, value: operands[0] },
                { type: op2Type, value: operands[1] },
              ],
            };
          } else {
            return 'Invalid operand 2 for ADD. Expected register or #8bit_Inm, got ' + operands[1];
          }
        } else {
          if (isGeneralReg(op2Type)) {
            // CASE: ADD r1, r2
            return {
              operation: Operation.ADD,
              operands: [
                { type: op1Type, value: operands[0] },
                { type: op2Type, value: operands[1] },
              ],
            };
          } else if (isInmediateVal(op2Type)) {
            const radix = op2Type === OperandType.HexInmediate ? 16 : 10;
            const value = parseInt(operands[1].slice(1), radix);
            if (value < 0 || value > 255) {
              return 'Invalid inmediate for ADD. Number out of range. Expected 0-255 but got ' + value;
            }
  
            // CASE: ADD r1, #0xFF
            return {
              operation: Operation.ADD,
              operands: [
                { type: op1Type, value: operands[0] },
                { type: op2Type, value: operands[1] },
              ],
            };
          } else {
            return 'Invalid operand 2 for ADD. Expected register or #8bit_Inm, got ' + operands[1];
          }
        }
      } else {
        // CASE: ADD r1, r2, #0xFF
        const op3Type = operandToOptype(operands[2]);
        if (op3Type === undefined || !isInmediateVal(op3Type)) {
          return 'Invalid operand 3 for ADD. Expected a #7bit_Inm, got ' + operands[2];
        } else if (op2Type === OperandType.HighRegister) {
          return 'Invalid register for ADD. Only low registers are allowed with inmediate values';
        }

        const radix = op3Type === OperandType.HexInmediate ? 16 : 10;
        const value = parseInt(operands[2].slice(1), radix);
        if (value < 0 || value > 7) {
          return 'Invalid inmediate for ADD. Number out of range. Expected 0-7 but got ' + value;
        }

        return {
          operation: Operation.ADD,
          operands: [
            { type: op1Type, value: operands[0] },
            { type: op2Type, value: operands[1] },
            { type: op3Type, value: operands[2] },
          ],
        };
      }
    }

    default:
      throw new Error('Unreachable code in line_to_op');
  }
}

function compile_assembly(source: string): Program {
  source = cleanInput(source);

  const textSectionIndex = source.indexOf('.text');
  const dataSectionIndex = source.indexOf('.data');
  if (textSectionIndex === -1) {
    return { error: { message: 'Missing .text directive', line: 0, column: 0 }, ins: [] };
  }

  let textSection = '';
  let dataSection = '';
  if (dataSectionIndex === -1) {
    // No data section in assembly, no memory needed
    textSection = source.slice(textSectionIndex + 5);
  } else if (dataSectionIndex < textSectionIndex) {
    // Data section is before text section
    textSection = source.slice(textSectionIndex + 5);
    dataSection = source.slice(dataSectionIndex + 5, textSectionIndex);
  } else {
    // Data section is after text section
    textSection = source.slice(textSectionIndex + 5, dataSectionIndex);
    dataSection = source.slice(dataSectionIndex + 5);
  }

  const lines = textSection.split('\n');
  const program: Program = {
    ins: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) {
      continue;
    }

    const op = lineToInstruction(line);
    if (typeof op === 'string') {
      program.error = { message: op, line: i, column: 0 };
      return program;
    } else {
      program.ins.push(op);
    }
  }

  return program;
}

export default compile_assembly;
export { Operation, OperandType, assert };
export type { Instruction };
