import cn from 'classnames';

const Card: React.FC<React.AllHTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('p-5 md:p-8 bg-surface shadow rounded', className)}
      {...props}
    />
  );
};

export default Card;
