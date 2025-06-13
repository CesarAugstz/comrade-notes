import { Button } from '@chakra-ui/react'

interface Props {
  onClick?: () => void
}

export default function SubmitButton({ onClick }: Props) {
  return (
    <Button
      type="submit"
      onClick={onClick}
      w="full"
      size="lg"
      bg="secondary.600"
      color="white"
      _hover={{ bg: 'secondary.700' }}
      _active={{ bg: 'secondary.800' }}
      fontWeight="semibold"
      borderRadius="lg"
    >
      Sign In
    </Button>
  )
}
