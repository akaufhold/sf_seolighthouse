<?php
declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Tests\Unit\Domain\Model;

use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

/**
 * Test case
 *
 * @author Andreas Kauhold <info@stackfactory.de>
 */
class LighthouseStatisticsTest extends UnitTestCase
{
    /**
     * @var \Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics
     */
    protected $subject;

    protected function setUp()
    {
        parent::setUp();
        $this->subject = new \Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics();
    }

    protected function tearDown()
    {
        parent::tearDown();
    }

    /**
     * @test
     */
    public function getFcpReturnsInitialValueForFloat()
    {
        self::assertSame(
            0.0,
            $this->subject->getFcp()
        );
    }

    /**
     * @test
     */
    public function setFcpForFloatSetsFcp()
    {
        $this->subject->setFcp(3.14159265);

        self::assertAttributeEquals(
            3.14159265,
            'fcp',
            $this->subject,
            '',
            0.000000001
        );
    }

    /**
     * @test
     */
    public function getSiReturnsInitialValueForFloat()
    {
        self::assertSame(
            0.0,
            $this->subject->getSi()
        );
    }

    /**
     * @test
     */
    public function setSiForFloatSetsSi()
    {
        $this->subject->setSi(3.14159265);

        self::assertAttributeEquals(
            3.14159265,
            'si',
            $this->subject,
            '',
            0.000000001
        );
    }

    /**
     * @test
     */
    public function getLcpReturnsInitialValueForString()
    {
        self::assertSame(
            '',
            $this->subject->getLcp()
        );
    }

    /**
     * @test
     */
    public function setLcpForStringSetsLcp()
    {
        $this->subject->setLcp('Conceived at T3CON10');

        self::assertAttributeEquals(
            'Conceived at T3CON10',
            'lcp',
            $this->subject
        );
    }

    /**
     * @test
     */
    public function getTtiReturnsInitialValueForString()
    {
        self::assertSame(
            '',
            $this->subject->getTti()
        );
    }

    /**
     * @test
     */
    public function setTtiForStringSetsTti()
    {
        $this->subject->setTti('Conceived at T3CON10');

        self::assertAttributeEquals(
            'Conceived at T3CON10',
            'tti',
            $this->subject
        );
    }

    /**
     * @test
     */
    public function getTbtReturnsInitialValueForString()
    {
        self::assertSame(
            '',
            $this->subject->getTbt()
        );
    }

    /**
     * @test
     */
    public function setTbtForStringSetsTbt()
    {
        $this->subject->setTbt('Conceived at T3CON10');

        self::assertAttributeEquals(
            'Conceived at T3CON10',
            'tbt',
            $this->subject
        );
    }

    /**
     * @test
     */
    public function getClsReturnsInitialValueForString()
    {
        self::assertSame(
            '',
            $this->subject->getCls()
        );
    }

    /**
     * @test
     */
    public function setClsForStringSetsCls()
    {
        $this->subject->setCls('Conceived at T3CON10');

        self::assertAttributeEquals(
            'Conceived at T3CON10',
            'cls',
            $this->subject
        );
    }
}
