class A {
  getB() {
    return new B();
  }
}

class B {
  getA() {
    return new A();
  }
}

A.B = B;

module.exports = A;
