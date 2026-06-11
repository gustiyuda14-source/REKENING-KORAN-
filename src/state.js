export const state = {
  studentName: '',
  mode: 'add',
  packagesAdd: [],
  packagesMul: [],
  packages: [],
  currentPackageIndex: null,
  currentQuestionIndex: 0,
  answers: [],
  isTestActive: false,
  sessionTime: 0
};

export function activePkgs() {
  return state.mode === 'add' ? state.packagesAdd : state.packagesMul;
}
