# Challenge - 배송비 계산

PO는 배송비 계산 및 부과 기능이 누락되어 있음을 발견하고 이 기능을 여러분에게 구현해 줄 것을 요청하였습니다. 다음과 같은 과정을 통해 이를 구현해 볼 수 있습니다.

1. 배송비를 계산하는 새 Lambda 함수를 생성합니다. 배송비 공식은 다음과 같습니다.
    ```javascript
      "Shipping Cost"  = "Last digit of postcode"/2 + 2
    ```

2. 구현된 Lambda 함수를 Step Function 정의에 추가합니다. Lambda 함수는 Step Function 정의 파일의 ProcessPayment 단계 전에 실행되어야 합니다.

3. Lambda 함수의 출력 JSON에서 ShippingCost 속성을 반환/추가합니다.

4. 총 결제 금액에 배송비를 추가하도록 ProcessPayment Lambda 함수를 수정합니다.

5. 배송비 챌린지를 완전히 구현하면 총 결제 금액에 배송비가 추가된 것을 확인할 수 있습니다.

---

## [[실습 시작 페이지로 돌아가기]](1-install-serverless-infrastructure.md)
