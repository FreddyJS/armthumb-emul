import compile_assembly, { Instruction, OperandType, Operation } from "./compiler";

const defaultMemorySize = 64;
const defaultStackSize = 64;
const defaultRegs = {
  // General purpose registers
  "r0": 0x00, "r1": 0x00, "r2": 0x00, "r3": 0x00, "r4": 0x00, "r5": 0x00, "r6": 0x00, "r7": 0x00,
  "r8": 0x00, "r9": 0x00, "r10": 0x00, "r11": 0x00, "r12": 0x00, "r13": 0x00, "r14": 0x00, "r15": 0x00
}

type armCPU_T = {
  regs: { [key: string]: number; },
  memory: number[],
  stack: number[],
  program: Array<Instruction>,
  pc: number,
  sp: number,

  // Methods
  run: () => void,
  step: () => void,
  reset: () => void,
  load: (program: Array<Instruction>) => void,
  load_assembly: (assembly: string) => void,
  execute: (ins: Instruction) => void,
}

const armCPU: armCPU_T = {
  regs: {...defaultRegs},
  memory: new Array(defaultMemorySize).fill(0),
  stack: new Array(defaultStackSize).fill(0),
  program: [],
  pc: 0,
  sp: 0,

  // Methods
  run: function() {
    for (let i = 0; i < this.program.length; i++) {
      this.execute(this.program[i]);
    }
  },
  step: function() {
    this.execute(this.program[this.pc]);
    this.pc++;
  },
  reset: function() {
    this.regs = {...defaultRegs};
    this.memory = new Array(defaultMemorySize).fill(0);
    this.stack = new Array(defaultStackSize).fill(0);
    this.program = [];
    this.pc = 0;
    this.sp = 0;
  },
  load: function(program: Array<Instruction>) {
    this.program = program;
  },
  load_assembly: function(assembly: string) {
    const compiled = compile_assembly(assembly);
    if (compiled.error) {
      throw new Error(compiled.error.message);
    }
    this.program = compiled.ins;
  },
  execute: function(ins: Instruction) {
    switch (ins.operation) {
      case Operation.MOV: {
        const [op1, op2] = ins.operands;
        // op1 is always a register and op2 can be a register or inmediate
        if (op2.type == OperandType.LowRegister || op2.type == OperandType.HighRegister) {
          this.regs[op1.value] = this.regs[op2.value];
        } else if (op2.type == OperandType.HexInmediate) {
          const value = parseInt(op2.value.replace("#0x", ""), 16);
          this.regs[op1.value] = value;
        } else if (op2.type == OperandType.DecInmediate) {
          const value = parseInt(op2.value.replace("#", ""), 10);
          this.regs[op1.value] = value;
        } else {
          throw new Error("Invalid operand type for MOV. This should never happen.");
        }
      } break;
    }
  },
}

export default armCPU;
export { armCPU_T }