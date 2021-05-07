(() => ({
  name: 'ConditionalWithSetValues',
  type: 'CONTAINER_COMPONENT',
  allowedTypes: ['BODY_COMPONENT', 'CONTAINER_COMPONENT', 'CONTENT_COMPONENT'],
  orientation: 'HORIZONTAL',
  jsx: (
    <div className={children.length === 0 ? classes.empty : undefined}>
      {(() => {
        const { useText, env } = B;
        const isDev = env === 'dev';
        const isPristine = isDev && children.length === 0;
        const [leftValue, setLeftValue] = useState(useText(options.left));
        const [rightValue, setRightValue] = useState(useText(options.right));

        const evalCondition = () => {
          const left = leftValue;
          const right = rightValue;
          const leftAsNumber = parseFloat(left);
          const rightAsNumber = parseFloat(right);

          switch (options.compare) {
            case 'neq':
              return left !== right;
            case 'contains':
              return left.indexOf(right) > -1;
            case 'notcontains':
              return left.indexOf(right) < 0;
            case 'gt':
              return leftAsNumber > rightAsNumber;
            case 'lt':
              return leftAsNumber < rightAsNumber;
            case 'gteq':
              return leftAsNumber >= rightAsNumber;
            case 'lteq':
              return leftAsNumber <= rightAsNumber;
            default:
              return left === right;
          }
        };

        const checkCondition = evalCondition();
        const initialVisibility = options.visible
          ? checkCondition
          : !checkCondition;
        const [visible, setVisible] = useState(false);

        useEffect(() => {
          setVisible(initialVisibility);
        }, [checkCondition]);

        useEffect(() => {
          if (visible) {
            B.triggerEvent('isTrue', true);
          } else {
            B.triggerEvent('isFalse', false);
          }
          B.triggerEvent('onChange', visible);
        }, [visible]);

        useEffect(() => {
          setVisible(evalCondition());
        }, [leftValue, rightValue])

        B.defineFunction('Hide', () => setVisible(false));
        B.defineFunction('Show', () => setVisible(true));
        B.defineFunction('Show/Hide', () => setVisible(s => !s));
        B.defineFunction('Set Visibility', value => {
          if (typeof value === 'boolean') setVisible(value);
        });
        B.defineFunction('Set Left Value', (value) => setLeftValue(value));
        B.defineFunction('Set Right Value', (value) => setRightValue(value));

        if (!isDev && !visible) return null;
        return isPristine ? 'Conditional' : children;
      })()}
    </div>
  ),
  styles: () => () => ({
    empty: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '2.5rem',
      fontSize: '0.75rem',
      color: '#262A3A',
      textTransform: 'uppercase',
      borderWidth: '0.0625rem',
      borderColor: '#AFB5C8',
      borderStyle: 'dashed',
      backgroundColor: '#F0F1F5',
    },
  }),
}))();
